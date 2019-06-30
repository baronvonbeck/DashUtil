from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
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

    # gets a file data object by primary key
    def get_file_data(self, file_data_id):
        return self.get(id=file_data_id)

    # uploads a new file, returns the data
    # TODO: set up path to amazon s3
    def upload_new_files(self, parent_directory, files_to_post):
        new_files = []
        size_increase = 0
        for f in files_to_post:
            new_files.append(File_Data(filename=f.name, 
                upload_path="test", 
                size=f.size, 
                parent_directory=parent_directory)
            )
            size_increase += f.size
        new_file_data = File_Data.file_datamanager.create_file_data(new_files)

        return size_increase, new_file_data

    # iteratively updates the parent directory sizes in bulk
    def update_parent_directory_sizes_iteratively(self, new_size, 
        next_parent):
        bulk_size_update_list = []

        while (next_parent is not None):
            next_parent.size += new_size
            bulk_size_update_list.append(next_parent)
            next_parent = next_parent.parent_directory
        
        self.bulk_update(bulk_size_update_list, ['size'])

    # calls method to recursively update parent directory sizes in bulk
    def update_parent_directory_sizes_recursively_entry(self, new_size, 
        next_parent):
        File_Data.file_datamanager.update_parent_directory_sizes_recursively(
            new_size, next_parent, [])

    # recursively updates the parent directory sizes in bulk
    def update_parent_directory_sizes_recursively(self, new_size, next_parent, 
        bulk_size_update_list):
        if (next_parent is None):
            self.bulk_update(bulk_size_update_list, ['size'])
        else:
            next_parent.size += new_size
            bulk_size_update_list.append(next_parent)
            File_Data.file_datamanager.update_parent_directory_sizes_recursively(
                new_size, next_parent.parent_directory, bulk_size_update_list)


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

        except (MultipleObjectsReturned, ObjectDoesNotExist) as e:
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
  