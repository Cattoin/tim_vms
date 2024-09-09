import frappe
from frappe.utils import today, pretty_date
no_cache = 1
def get_context(context):
	if frappe.session.user != "Guest":
		context.curr_user = frappe.session.user
		current_user = frappe.session.user
		print(current_user)
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
		print(recent_doc[0])

		context.volreginfo = frappe.db.get_value(
			'TIM Registration',
			recent_doc[0],
			['vol_contact_number', 'preferred_day', 'assigned_center', 'volunteer_status'],
			as_dict=True
		)
		center_id = context.volreginfo['assigned_center']
		context.center_name = frappe.db.get_value('TIM Center', center_id, 'center_name')
	return context