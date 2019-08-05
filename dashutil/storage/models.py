from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.utils import timezone
from dashutil.S3Boto3Handler import s3_multi_part_upload, s3_delete_url_list
import uuid
# Managers #

# File_Data manager class
class File_DataManager(models.Manager):
    # creates the file_data for any new files
    def create_file_data(self, list_of_files):
        new_file_data = self.bulk_create(list_of_files)
        return new_file_data

    # create the related file_data for a new storage page
    def create_storage_data(self, storage_page_name):
        storage_file_data = self.create(filename=storage_page_name, 
                                    upload_path=None, 
                                    size=0.0, 
                                    parent_directory=None
                                )

        return storage_file_data
    
    # return the child files of the storage
    def get_children_of_storage(self, storage_object):
        storage_file_data = Storage.storage_manager.get_related_file_data(storage_object)

        # TODO: default filter for return (directories first, 
        # first created, last updated, first updated, etc)
        return self.filter(parent_directory=storage_file_data)

    # return the child files of the storage
    def get_children_of_directory(self, directory):
        
        # TODO: default filter for return (directories first, 
        # first created, last updated, first updated, etc)
        return self.filter(parent_directory=directory)

    # gets a file data object by primary key
    def get_file_data(self, file_data_id):
        return self.get(id=file_data_id)

    # uploads a new file, returns the data
    def upload_new_files(self, new_parent_directory, storage_name, files_to_post):
        new_files = []
        size_increase = 0
        for f in files_to_post:
            # upload file to s3
            uploaded_file_url = s3_multi_part_upload(f, storage_name)
            new_files.append(File_Data(filename=f.name, 
                upload_path=uploaded_file_url, 
                size=f.size, 
                parent_directory=new_parent_directory)
            )
            size_increase += f.size
        new_file_data = File_Data.file_datamanager.create_file_data(new_files)

        return size_increase, new_file_data

    # gets full path and url info for file downloading on client
    def get_download_information(self, files_to_download, prepend):
        file_path_url_list = []
        unique_names = {}

        for f in files_to_download:
            fname = f.filename

            if (f.upload_path):
                print(f.filename)
                temp = f.filename.rsplit('.')
                
                if fname in unique_names:
                    fname = temp[0] + " (" + str(unique_names[f.filename]) + \
                        ")." + temp[1] 
                    unique_names[f.filename] += 1
                    
                unique_names[fname] = 1

                file_path_url_list.append(
                    [prepend + fname, f.upload_path])
            else:
                if fname in unique_names:
                    fname = fname + " (" + str(unique_names[f.filename]) + ")"
                    unique_names[f.filename] += 1
                    
                unique_names[fname] = 1

                sub_dir_file_path_url_list = \
                    File_Data.file_datamanager.get_download_information(
                        File_Data.file_datamanager.get_children_of_directory(f),
                        prepend + fname + "/")
                
                if (not len(sub_dir_file_path_url_list)):
                    file_path_url_list.append(
                        [prepend + fname + "/", None])
                else:
                    for sub in sub_dir_file_path_url_list:
                        file_path_url_list.append(sub)

        return file_path_url_list
    
    # creates a new directory, returns the data
    def create_new_directory(self, new_parent_directory, new_directory_name):
        new_directory = []
        new_directory.append(File_Data(filename=new_directory_name, 
            upload_path=None, 
            size=0, 
            parent_directory=new_parent_directory)
        )

        new_directory_data = File_Data.file_datamanager.create_file_data(new_directory)

        return new_directory_data
    
    # renames a file to the given filename. automatically append correct extension
    # if necessary
    def rename_files(self, new_name, files_ids_to_rename):
        bulk_rename_list = []
        new_extension = new_name.split(".")[-1]
        new_timestamp = timezone.now()
        for file_id in files_ids_to_rename:
            file_to_rename = File_Data.file_datamanager.get_file_data(file_id)
            extension = file_to_rename.filename.split(".")[-1]
            if (extension != new_extension and
                file_to_rename.upload_path is not None):
                file_to_rename.filename = new_name + "." + extension
            else:
                file_to_rename.filename = new_name

            file_to_rename.modify_timestamp = new_timestamp
            bulk_rename_list.append(file_to_rename)

        self.bulk_update(bulk_rename_list, ['filename', 'modify_timestamp'])
        return bulk_rename_list

    # deletes a list of files/directories
    def delete_files(self, file_ids_to_delete, storage_name):
        bulk_delete_list = []
        bulk_url_delete_list = set()
        bulk_size_update_list = {}

        for file_id in file_ids_to_delete:

            file_to_delete = File_Data.file_datamanager.get_file_data(file_id)
            current_parent_id = str(file_to_delete.parent_directory_id)

            bulk_delete_list.append(file_to_delete)

            if (current_parent_id in bulk_size_update_list):
                bulk_size_update_list[current_parent_id] -= file_to_delete.size
            else:
                bulk_size_update_list[current_parent_id] = file_to_delete.size * -1
            
            if (file_to_delete.upload_path is not None):
                bulk_url_delete_list.add(file_to_delete.upload_path)
            else: 
                bulk_url_delete_list = File_Data.file_datamanager._get_urls_of_all_subchildren(
                    bulk_url_delete_list,
                    File_Data.file_datamanager.get_children_of_directory(file_to_delete))

        self.filter(id__in=file_ids_to_delete).delete()

        File_Data.file_datamanager.update_list_of_file_id_sizes(
            bulk_size_update_list)
        
        s3_delete_url_list(list(bulk_url_delete_list), storage_name)

        return bulk_delete_list
    
    # moves a list of files to a given directoy
    def move_files(self, new_parent_directory, file_ids_to_move):
        bulk_parent_update_list = []
        bulk_size_update_list = {str(new_parent_directory.id): 0}

        for file_id in file_ids_to_move:

            file_to_move = File_Data.file_datamanager.get_file_data(file_id)
            current_parent = file_to_move.parent_directory
            file_to_move.parent_directory = new_parent_directory
            print(file_to_move.filename)
            print(file_to_move.size)
            print(bulk_size_update_list)
            print("---------------------------------------")

            bulk_parent_update_list.append(file_to_move)

            if (str(current_parent.id) in bulk_size_update_list):
                bulk_size_update_list[str(current_parent.id)] -= file_to_move.size
            else:
                bulk_size_update_list[str(current_parent.id)] = file_to_move.size * -1

            bulk_size_update_list[str(new_parent_directory.id)] += file_to_move.size

            print(bulk_size_update_list)
            print("---------------------------------------")
            
        self.bulk_update(bulk_parent_update_list, ['parent_directory'])

        File_Data.file_datamanager.update_list_of_file_id_sizes(
            bulk_size_update_list)

        return bulk_parent_update_list
    
    # returns a list of all of the urls of all subchildren for a directory
    def _get_urls_of_all_subchildren(self, bulk_url_delete_list, child_list):
        for child in child_list:
            if (child.upload_path is not None):
                bulk_url_delete_list.add(child.upload_path)
            else: 
                bulk_url_delete_list = File_Data.file_datamanager._get_urls_of_all_subchildren(
                    bulk_url_delete_list,
                    File_Data.file_datamanager.get_children_of_directory(child))
        
        return bulk_url_delete_list

    # given a dict of file ids to update by a given size, performs
    # a bulk update on that list
    def update_list_of_file_id_sizes(self, files_to_update):
        for next_parent_id, size_change in files_to_update.items():
            File_Data.file_datamanager.update_parent_directory_sizes_iteratively(
                size_change, 
                File_Data.file_datamanager.get_file_data(next_parent_id))

            # bulk_update_size_list = File_Data.file_datamanager._merge_file_size_update_lists(
            #     bulk_size_update_list, 
            #     File_Data.file_datamanager.update_parent_directory_sizes_iteratively(
            #           next_parent, size_change))


    # iteratively updates the parent directory sizes in bulk
    def update_parent_directory_sizes_iteratively(self, size_change, 
        next_parent):
        bulk_size_update_list = []

        while (next_parent is not None):
            next_parent.size += size_change
            bulk_size_update_list.append(next_parent)
            next_parent = next_parent.parent_directory
        
        self.bulk_update(bulk_size_update_list, ['size'])

    # calls method to recursively update parent directory sizes in bulk
    def update_parent_directory_sizes_recursively_entry(self, size_change, 
        next_parent):
        File_Data.file_datamanager.update_parent_directory_sizes_recursively(
            size_change, next_parent, [])

    # recursively updates the parent directory sizes in bulk
    def update_parent_directory_sizes_recursively(self, size_change, next_parent, 
        bulk_size_update_list):
        if (next_parent is None):
            self.bulk_update(bulk_size_update_list, ['size'])
        else:
            next_parent.size += size_change
            bulk_size_update_list.append(next_parent)
            File_Data.file_datamanager.update_parent_directory_sizes_recursively(
                size_change, next_parent.parent_directory, bulk_size_update_list)

    # merges sizes on 2 lists into 1 list
    # def _merge_file_size_update_lists(file_list, merge_list): 
    #     for f in file_list:
    #         found = False
    #         for m in merge_list:
    #             if (f.id == m.id):
    #                 f.size



# Storage manager class #
class StorageManager(models.Manager):
    # get or create the storage. returns storage, and boolean value 
    # created (true if created, false if already exists)
    def get_or_create_storage(self, storage_page_name):
        try:
            storage = self.get(storage_name=storage_page_name)

            # object exists, return it and created = false
            print("Retrieved storage: " + storage_page_name)
            return storage, False

        except (MultipleObjectsReturned, ObjectDoesNotExist):
            # shouldn't be possible, do something
            # print("what")
            # return None

            # object not found, so we create it. return created = true

            print("Created storage: " + storage_page_name)
        
            storage_data = File_Data.file_datamanager.create_storage_data(storage_page_name)
            storage = self.create(storage_name=storage_page_name, id=storage_data)

            return storage, True
    
    # return the related file_data for a storage room object
    def get_related_file_data(self, storage_object):
        return storage_object.id
    



# Tables #

##
#   File_Data
#   
#   id                  - Unique primary key
#   filename            - Name of file
#   upload_path         - Path to file file in AWS. If null, it is a directory
#   create_timestamp    - Time file was added to application
#   modify_timestamp    - Last time the file was modified
#   size                - Size of the file in bytes. For a directory, the sum of all child files
#   parent_directory    - Parent directory of the file. If null, the file is a Storage and has no parent
#     
##
class File_Data(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    filename            = models.TextField()
    upload_path         = models.TextField(null=True)
    create_timestamp    = models.DateTimeField(auto_now_add=True)
    modify_timestamp    = models.DateTimeField(auto_now=True)
    size                = models.FloatField()
    parent_directory    = models.ForeignKey(
                            'File_Data', 
                            null=True, 
                            blank=False, 
                            on_delete=models.CASCADE
                        )
    
    file_datamanager    = File_DataManager()
    
    class Meta():
        db_table = 'File_Data'

        

##
#   Storage
#   
#   storage_name        - Primary key storage name
#   id                  - Unique primary key, and one to one relationship with File_Data
#   
##
class Storage(models.Model):
    storage_name        = models.TextField(primary_key=True)
    id                  = models.OneToOneField(
                            File_Data, 
                            on_delete=models.CASCADE, 
                            unique=True
                        )
    
    storage_manager     = StorageManager()

    class Meta():
    	db_table = 'Storage'
  