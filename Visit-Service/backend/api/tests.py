import json

from django.test import TestCase
from .models import *
from rest_framework.test import APIRequestFactory


class TestServiceApi(TestCase):
    fixtures = ["./api/fixtures/new_data5.json"]
    client = APIRequestFactory()

    def test_get_services(self):
        response = self.client.get("/api/services/")
        self.assertEquals(len(response.data), len(Service.objects.all()))
        service = Service.objects.get(id=response.data[0]["id"])

        self.assertEquals(response.data[0]["name"], service.name)
        self.assertEquals(response.data[0]["description"], service.description)
        self.assertEquals(response.data[0]["price"], str(service.price))

    def test_get_services_by_id(self):
        service = Service.objects.get(id=2)
        response = self.client.get("/api/services/2")
        self.assertEquals(response.data["id"], str(service.id))
        self.assertEquals(response.data["name"], service.name)
        self.assertEquals(response.data["description"], service.description)
        self.assertEquals(response.data["price"], str(service.price))
        self.assertEquals(response.data["doctor"]["id"], str(service.doctor.id))

    def test_get_service_wrong_id(self):
        response = self.client.get("/api/services/123/")
        self.assertEquals(response.status_code, 404)

    def test_post_service(self):
        service = {"name": "Konsultacja", "description": "some description", "price": "30", "doctor_id": "1"}

        response = self.client.post("/api/services/", service, format="json")
        self.assertEquals(response.status_code, 201)
        self.assertTrue(Service.objects.filter(doctor__id=1))

    # def test_patch_service(self):
    #     patch_data = {"price": "420"}
    #     response = self.client.patch("/api/services/1", patch_data, format="json")
    #     service = Service.objects.get(id=1)
    #     self.assertEquals(response.status_code, 200)
    #     self.assertEquals(service.price, "420")


class TestDoctorApi(TestCase):
    fixtures = ["./api/fixtures/new_data5.json"]
    client = APIRequestFactory()

    def test_get_availability_schedule(self):
        availability_schedule = Doctor.objects.get(id=1).availability_table
        response = self.client.get("/api/doctors/1/availability_table/")
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data["monday"]["start"], str(availability_schedule.monday.start)[:-3])
        self.assertEquals(response.data["monday"]["end"], str(availability_schedule.monday.end)[:-3])

        self.assertEquals(response.data["tuesday"]["start"], str(availability_schedule.tuesday.start)[:-3])
        self.assertEquals(response.data["tuesday"]["end"], str(availability_schedule.tuesday.end)[:-3])

        self.assertEquals(response.data["wednesday"], availability_schedule.wednesday)

        self.assertEquals(response.data["thursday"]["start"], str(availability_schedule.thursday.start)[:-3])
        self.assertEquals(response.data["thursday"]["end"], str(availability_schedule.thursday.end)[:-3])

        self.assertEquals(response.data["friday"]["start"], str(availability_schedule.friday.start)[:-3])
        self.assertEquals(response.data["friday"]["end"], str(availability_schedule.friday.end)[:-3])

        self.assertEquals(response.data["saturday"], availability_schedule.saturday)

        self.assertEquals(response.data["sunday"], availability_schedule.sunday)

    # def test_post_availability_shedule(self):
    #     data = {"monday": "", "tuesday": "", "wednesday": "", "thursday": "", "friday": "",
    #             "saturday": "", "sunday": ""}
    #
    #     response = self.client.post("/api/doctors/3/availability_table/", data)
    #
    #     self.assertEquals(response.status_code, 301)
    #     self.assertTrue(Doctor.objects.get(id=3).availability_table)
    #
    # def test_patch_availability_schedule(self):
    #     data = {"monday": {"start": "10:00", "end": "13:00"}}
    #     response = self.client.patch("/api/doctors/1/availability_table/", data)
    #
    #     doctor = Doctor.objects.get(id=1)
    #     self.assertEquals(response.status_code, 301)
    #     self.assertEquals(doctor.availability_table.monday.start, "10:00:00")


class TestLogin(TestCase):
    fixtures = ["./api/fixtures/new_data5.json"]
    client = APIRequestFactory()

    def test_login_doctor(self):
        data = {"username": "Adam", "password": "Małysz"}
        response = self.client.post("/api/login/", data, format="json")

        self.assertEquals(response.status_code, 200)
        data = response.content.decode()
        data = json.loads(data)
        self.assertEquals(data["id"], 1)
        self.assertEquals(data["type"], "doctor")

    def test_login_customer(self):
        data = {"username": "jan2115", "password": "pies123"}
        response = self.client.post("/api/login/", data, format="json")

        self.assertEquals(response.status_code, 200)

        self.assertEquals(response.data["id"], 1)
        self.assertEquals(response.data["type"], "customer")


    def test_login_wrong_credentials(self):
        data = {"username": "as", "password": "www"}
        response = self.client.post("/api/login/", data, format="json")

        self.assertEquals(response.status_code, 404)

class TestOrders(TestCase):
    fixtures = ["./api/fixtures/new_data5.json"]
    client = APIRequestFactory()

    def test_get_orders_by_doctor_id(self):
        response = self.client.get("/api/doctors/1/orders/")
        self.assertEquals(response.status_code, 200)

        self.assertEquals(len(response.data), len(Order.objects.filter(service__doctor__id=1)))

    def test_get_orders_by_customer_id(self):
        response = self.client.get("/api/customers/1/orders/")
        self.assertEquals(response.status_code, 200)

        self.assertEquals(len(response.data), len(Order.objects.filter(customer__id=1)))

    def test_post_order(self):
        body = {"date": "2024-05-10T14:30:00.000Z", "customer_id": "1", "service_id": "4"}
        response = self.client.post("http://localhost:8000/api/doctors/1/orders/", body)

        self.assertEquals(response.status_code, 201)
        order_id = response.data["id"]
        self.assertTrue(Order.objects.filter(id=order_id).exists())
        order = Order.objects.get(id=order_id)
        self.assertEquals(order.service.id, 4)
        self.assertEquals(order.customer.id, 1)
