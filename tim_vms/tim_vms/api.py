import frappe

@frappe.whitelist()
def postrsvp(rsvp_status, date, volunteer, reason):
	"""Saves the code edited in one of the sections."""
	doc = frappe.get_doc(
		doctype="TIM RSVP", rsvp_status=rsvp_status, date=date, volunteer=volunteer, reason=reason
	)
	doc.insert()
	return {"name": doc.name}

@frappe.whitelist()
def postdevicenotifid(token):
    doc = frappe.get_doc(
        doctype="TIM User Notif", token=token, volunteer=frappe.session.user
    )
    doc.insert()
    return