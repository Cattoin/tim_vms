import frappe
import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

server_key = '/home/frappeusr/servicefile.json'
cred = credentials.Certificate(server_key)
default_app = firebase_admin.initialize_app(cred)

@frappe.whitelist()
def send_notification(doc):
    device_tokens = frappe.get_list('TIM User Notif',
        filters={'volunteer': 'user_email'},
        fields=['token'],
        as_list=True
    )
    device_tokens = [token[0] for token in device_tokens]
    title = doc.title
    body = doc.body
    send_push_notification(device_tokens, title, body)

def send_push_notification(device_tokens, title, body, data=None):

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