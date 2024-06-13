from .settings import *
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get("POSTGRES_DB"),
        'USER': os.environ.get("POSTGRES_USER"),
        'PASSWORD': os.environ.get("POSTGRES_PASSWORD"),
        'HOST': os.environ.get("DB_HOST"),
        'PORT': '5432',
    }
}

CORS_ALLOW_ALL_ORIGINS = True


# c2cbe32c-4c3a-4913-af56-42f97414aa2a

# 08d7fe69-3f69-4145-98cc-aa33d5b9d05f

# fcb8dcae-a6ee-418f-b87f-9c6a96989e27