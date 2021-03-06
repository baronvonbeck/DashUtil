"""
Django settings for dashutil project.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
if 'RDS_DB_NAME' in os.environ:
    DEBUG = False
else:
    DEBUG = True

ALLOWED_HOSTS = ['dashutil-env.us-west-2.elasticbeanstalk.com', 
                 'dashutil-env-1.us-west-2.elasticbeanstalk.com', 
                 'dashutil.com', '*.dashutil.com', 'www.dashutil.com',
                 '.dashutil.com', 'localhost']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'home',
    'about',
    'storage',
    'single'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'dashutil.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
                    os.path.join(BASE_DIR, './home/templates/'),
                    os.path.join(BASE_DIR, './about/templates/'),
                    os.path.join(BASE_DIR, './storage/templates/'),
                    os.path.join(BASE_DIR, './single/templates/'),
                    os.path.join(BASE_DIR, './static/html/'),
                    os.path.join(BASE_DIR, './static/js/'),
                ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'dashutil.wsgi.application'


# Database and S3
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

if 'RDS_DB_NAME' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.environ['RDS_DB_NAME'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOSTNAME'],
            'PORT': os.environ['RDS_PORT'],
        }
    }

    AWS_ACCESS_KEY_ID = os.environ['AWS_S3_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['AWS_S3_SECRET_ACCESS_KEY']
    AWS_STORAGE_BUCKET_NAME = os.environ['AWS_S3_STORAGE_BUCKET_NAME']
    AWS_REGION = os.environ['AWS_S3_REGION']
    AWS_SUBFOLDER_NAME = os.environ['AWS_SUBFOLDER_NAME']
    AWS_OBJECT_PARAMETERS = os.environ['AWS_S3_OBJECT_PARAMETERS']

else:
    from .env_ignore import *

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'dashutil_postgres_db',
            'USER': 'dashutil_db',
            'PASSWORD': 'dashutil_db',
            'HOST': 'localhost',
            'PORT': '5434',
        }
    }

    AWS_ACCESS_KEY_ID = AWS_S3_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY = AWS_S3_SECRET_ACCESS_KEY
    AWS_STORAGE_BUCKET_NAME = AWS_S3_STORAGE_BUCKET_NAME
    AWS_REGION = AWS_S3_REGION
    AWS_SUBFOLDER_NAME = AWS_S3_SUBFOLDER_NAME
    AWS_OBJECT_PARAMETERS = AWS_S3_OBJECT_PARAMETERS


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, '../www/static')

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, './static/'),
    os.path.join(BASE_DIR, './home/static/'),
    os.path.join(BASE_DIR, './about/static/'),
    os.path.join(BASE_DIR, './storage/static/'),
    os.path.join(BASE_DIR, './single/static/')
]
