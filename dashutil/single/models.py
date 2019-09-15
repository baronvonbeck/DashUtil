from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned, ValidationError
import uuid
from dashutil.S3Boto3Handler import s3_multi_part_upload

# Managers #

# Single_File_Data manager class
class SingleManager(models.Manager):
    # gets a file data object by primary key
    def get_single_file_data(self, file_data_id):
        try: 
            return self.get(id=file_data_id)
        except (MultipleObjectsReturned, ObjectDoesNotExist, ValidationError, ValueError) as e:
            # file wasn't found
            return None

    # uploads a new file, returns the id
    def upload_single_file(self, file_to_post):
        # upload file to s3
        new_file_name = file_to_post.name
        uploaded_file_url = s3_multi_part_upload(file_to_post, 'single')
        new_file_data = self.create(filename=Single_File_Data.single_manager._convert_string(new_file_name), 
            upload_path=uploaded_file_url, 
            size=file_to_post.size
        )

        return new_file_data.id
    
    def _convert_string(self, s):
        return s.replace('\\','').replace('/', '').replace('\'', '').replace('\"', '') \
            .replace(':', '').replace('<', '').replace('>', '') \
            .replace('*', '').replace('?', '').replace('|', '')



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
class Single_File_Data(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    filename            = models.TextField()
    upload_path         = models.TextField(null=True)
    create_timestamp    = models.DateTimeField(auto_now_add=True)
    modify_timestamp    = models.DateTimeField(auto_now=True)
    size                = models.FloatField()
    
    single_manager      = SingleManager()

    class Meta():
        db_table = 'Single_File_Data'
  