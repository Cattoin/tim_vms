import frappe
import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

@frappe.whitelist()
def send_notification(doc):
    server_key = '/home/frappeusr/servicefile.json'
    device_tokens = frappe.get_list('TIM User Notif',
        filters={'volunteer': 'user_email'},
        fields=['token'],
        as_list=True
    )
    title = doc.title
    body = doc.body
    send_push_notification(server_key, device_tokens, title, body)

def send_push_notification(server_key, device_tokens, title, body, data=None):
    cred = credentials.Certificate(server_key)
    firebase_admin.initialize_app(cred)

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        tokens=device_tokens
    )
    if data:
        message.data = data

    response = messaging.send_multicast(message)

    print("Successfully sent notification:", response)