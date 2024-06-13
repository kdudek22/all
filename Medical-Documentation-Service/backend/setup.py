from setuptools import setup, find_packages

setup(
    name="backend",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "psycopg2-binary",
        "pydantic",
        "sqlalchemy",
        "alembic",
        "uvicorn",
        "python-dotenv",
    ],
)
