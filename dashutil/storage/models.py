from django.db import models


class Storage(models.Model):
    storage_name = models.TextField(primary_key=True)
    
    class Meta():
    	db_table = 'Storage'