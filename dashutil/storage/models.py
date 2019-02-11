from django.db import models


class Storage(models.Model):
    storage_name = models.TextField(primary_key=True)
    
    class Meta():
    	db_table = 'Storage'

class File_In_Storage(models.Model):
    create_timestamp = models.DateTimeField(auto_now_add=True)
    modify_timestamp = models.DateTimeField(auto_now=True)
    upload = models.FileField()

    class Meta():
    	db_table = 'File_In_Storage'