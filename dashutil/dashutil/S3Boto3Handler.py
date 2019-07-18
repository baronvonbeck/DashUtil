# handler for all s3 interactions, done through boto3
# https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-examples.html
import threading
import boto3
import sys
import uuid
from dashutil.settings import AWS_STORAGE_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SUBFOLDER_NAME
from boto3.s3.transfer import TransferConfig


session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)
s3_resource = session.resource('s3')


# uploads a file to s3
# links will be in the form:
#       https://dashutil-files.s3-us-west-2.amazonaws.com/dashutil/asdf/c05e5998-a99f-4831-8207-d501fea388f1__filename.png
def s3_multi_part_upload(file_to_upload, s_name):
    config = TransferConfig(multipart_threshold=1024 * 25, max_concurrency=10,
                            multipart_chunksize=1024 * 25, use_threads=True)

    random_uuid = str(uuid.uuid4())
    filename = str(file_to_upload.name).replace(' ', '_')
    key_path = AWS_SUBFOLDER_NAME + '/' + s_name + '/' + random_uuid + '__' + filename

    s3_resource.meta.client.upload_fileobj(
                            file_to_upload, AWS_STORAGE_BUCKET_NAME, key_path,
                            ExtraArgs={'ACL': 'public-read', 
                                        'ContentType': file_to_upload.content_type},
                            Config=config,
                            Callback=ProgressPercentage(file_to_upload)
                        )
    
    return 'https://' + AWS_STORAGE_BUCKET_NAME + '.s3-' + AWS_REGION + '.amazonaws.com/' + key_path


# deletes files for a given upload path from s3, in batch sizes of 1000
def s3_delete_url_list(urls_to_delete):
    delete_keys = {'Objects': []}
    for key in urls_to_delete:
        delete_keys['Objects'].append({'Key': key})

        if (len(delete_keys['Objects']) >= 1000):
            s3_resource.delete_objects(Bucket=AWS_STORAGE_BUCKET_NAME, 
                Delete=delete_keys)
            delete_keys = {'Objects': []}
    
    if (len(delete_keys['Objects'])):
        s3_resource.delete_objects(Bucket=AWS_STORAGE_BUCKET_NAME, 
            Delete=delete_keys)


class ProgressPercentage(object):
    def __init__(self, file_to_upload):
        self._filename = file_to_upload.name
        self._size = float(file_to_upload.size)
        self._seen_so_far = 0
        self._lock = threading.Lock()

    def __call__(self, bytes_amount):
        with self._lock:
            self._seen_so_far += bytes_amount
            percentage = (self._seen_so_far / self._size) * 100
            sys.stdout.write(
                "\r%s  %s / %s  (%.2f%%)" % (
                    self._filename, self._seen_so_far, self._size,
                    percentage))
            sys.stdout.flush()