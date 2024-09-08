import frappe
from frappe.utils import today, pretty_date
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

		context.volreginfo = frappe.db.get_list(
			"TIM Registration",
			filters={"vol_email":current_user},
			fields=['vol_contact_number', 'preferred_day', 'assigned_center', 'volunteering_status'],
			limit=1
		)
	return context
