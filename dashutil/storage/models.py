from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
import uuid

# Managers #

# File_Data manager class
class File_DataManager(models.Manager):
    # creates the file_data for any new file
    def create_file_data(self, new_filename, new_upload_path, new_size, new_parent_directory):
        new_file_data = self.create(filename=new_filename, 
                                    upload_path=new_upload_path, 
                                    size=new_size, 
                                    parent_directory=new_parent_directory
                                )
        return new_file_data

    # create the related file_data for a new storage page
    def create_storage_data(self, storage_page_name):
        storage_file_data = self.create_file_data(storage_page_name, None, 0.0, None)

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
    def upload_new_file(self, new_filename, new_size, new_parent_id):
        parent_file_data = self.get_file_data(new_parent_id)
        new_file_data = self.create_file_data(new_filename, "test", new_size, parent_file_data)

        return new_file_data

    # iteratively updates the parent directory sizes in bulk
    def update_parent_directory_sizes_iteratively(self, file_uploaded):
        bulk_size_update_list = []
        next_parent = file_uploaded.parent_directory
        new_size = file_uploaded.size

        while (next_parent is not None):
            next_parent.size += new_size
            bulk_size_update_list.append(next_parent)
            next_parent = next_parent.parent_directory
        
        self.bulk_update(bulk_size_update_list, ['size'])

    # calls method to recursively update parent directory sizes in bulk
    def update_parent_directory_sizes_recursively_entry(self, file_uploaded):
        self.update_parent_directory_sizes_recursively(
            file_uploaded.size, file_uploaded.parent_directory, [])

    # recursively updates the parent directory sizes in bulk
    def update_parent_directory_sizes_recursively(self, new_size, next_parent, 
        bulk_size_update_list):
        if (next_parent is None):
            self.bulk_update(bulk_size_update_list, ['size'])
        else:
            next_parent.size += new_size
            bulk_size_update_list.append(next_parent)
            self.update_parent_directory_sizes_recursively(
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
  