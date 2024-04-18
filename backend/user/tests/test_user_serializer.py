from unittest.mock import ANY


def test_user_serializer(user_client, user_data):
    details = user_client.get("/users/user/")
    assert details.status_code == 200
    assert details.data == {
        "id": ANY,
        "username": user_data["username"],
        "email": user_data["email"],
        "is_staff": False,
        "profile": {},
    }


# def test_admin_serializer(admin_client, admin_data):
#     details = admin_client.get("/users/user/")
#     assert details.status_code == 200
#     assert details.data == {
#         "id": ANY,
#         "username": admin_data["username"],
#         "email": admin_data["email"],
#         "is_staff": True,
#         "profile": {},
#     }


# def test_user_updates(user_client, user_data):
#     route = "/users/user/"
#     details = lambda: user_client.get(route).data
#     assert details()["username"] == user_data["username"]
#     response = user_client.patch(
#         route,
#         {"username": "NewName"},
#         content_type="application/json",
#     )
#     assert response.status_code == 200

#     assert not details()["username"] == user_data["username"]
