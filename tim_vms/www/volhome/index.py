import frappe
from frappe.utils import today, pretty_date
from datetime import datetime
no_cache = 1
def get_context(context):
	if frappe.session.user != "Guest":
		context.curr_user = frappe.session.user
		current_user = frappe.session.user
		context.ecount = frappe.db.count('TIM Volunteering', {'volunteer_email': current_user})
		hrsscount = frappe.db.get_value('TIM Volunteering', {'volunteer_email': current_user}, 'sum(hours)')
		if hrsscount == None:
			context.hrscount = 0
		else:
			context.hrscount = hrsscount
		context.userinfo = frappe.db.get_value(
		"User",
			current_user,
			[
				"name",
				"first_name",
				"mobile_no",
			],
			as_dict=True,
		)

		recent_doc = frappe.get_all(
			'TIM Registration',
			pluck='name',
			filters={'vol_email': current_user},
			order_by='creation desc',
			limit=1
		)

		recent_rsvp = frappe.get_all(
			'TIM RSVP',
			pluck='name',
			filters={'volunteer': current_user},
			order_by='creation desc',
			limit=1
		)

		context.recent_rsvp_date = frappe.db.get_value(
			'TIM RSVP',
			recent_rsvp[0],
			['date'],
			as_dict=True
		)

		# Initialize a variable to store the result
		rsvp_check_result = None

		# Assuming context.recent_rsvp_date['date'] is a datetime.date object
		rsvp_date = context.recent_rsvp_date['date']

		context.volreginfo = frappe.db.get_value(
			'TIM Registration',
			recent_doc[0],
			['vol_contact_number', 'preferred_day', 'assigned_center', 'volunteer_status'],
			as_dict=True
		)
		center_id = context.volreginfo['assigned_center']
		preferred_day = context.volreginfo['preferred_day']
		context.center_name = frappe.db.get_value('TIM Center', center_id, 'center_name')

		# Check if rsvp_date is not None and is in the future
		if rsvp_date:
			current_date = datetime.now().date()  # Get the current date

			# Check if the RSVP date is in the future
			if rsvp_date > current_date:
				context.rsvp_check_result = True 
			else:
				context.rsvp_check_result = False
		else:
			context.rsvp_check_result = None 
		context.volreginfo = frappe.db.get_value(
			'TIM Registration',
			recent_doc[0],
			['vol_contact_number', 'preferred_day', 'assigned_center', 'volunteer_status'],
			as_dict=True
		)
		center_id = context.volreginfo['assigned_center']
		context.center_name = frappe.db.get_value('TIM Center', center_id, 'center_name')
	return context