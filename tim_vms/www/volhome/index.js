frappe.ready(() => {
    check_login();
});

const check_login = () =>{
    if (frappe.session.user == "Guest"){
        console.log('is a guest')
        window.location.href = `/login?redirect-to=/volhome/`;
        return;
    }
}
const rsvpPrompt = document.getElementById('rsvpPrompt');
const preferred_day = rsvpPrompt.getAttribute('data-preferred-day');
const email = rsvpPrompt.getAttribute('data-email');
console.log(preferred_day);
console.log('which day?');
document.getElementById('yesButton').addEventListener('click', () => {
    const date = getNextDate(preferred_day);
    frappe.call("tim_vms.tim_vms.api.postrsvp", {
        rsvp_status: "Yes",
        date: date,
        volunteer: email,
        reason: "NA"
      })
      .then(r => {
        if (r.message.ok) {
          frappe.msgprint(`Posted RSVP`);
        }
        else {
          frappe.msgprint(r.message.error);
        }
    });
    rsvpPrompt.classList.add('hidden');
    thanksMessage.classList.remove('hidden');
});

document.getElementById('noButton').addEventListener('click', () => {
    rsvpPrompt.classList.add('hidden');
    reasonContainer.classList.remove('hidden');
});

document.getElementById('submitReason').addEventListener('click', () => {
    const reason = reasonInput.value;
    if (reason) {
        const date = getNextDate(preferred_day);
        frappe.call("tim_vms.tim_vms.api.postrsvp", {
            rsvp_status: "No",
            date: date,
            volunteer: email,
            reason: reason
          })
          .then(r => {
            if (r.message.ok) {
              frappe.msgprint(`Posted RSVP`);
            }
            else {
              frappe.msgprint(r.message.error);
            }
        });
        reasonContainer.classList.add('hidden');
        thanksMessage.classList.remove('hidden');
    } else {
        alert("Please provide a reason!");
    }
});

function getNextDate(day) {
    const today = new Date();
    const daysOfWeek = { "saturday": 6, "sunday": 0 };
    const targetDay = daysOfWeek[day];
    const daysUntilNext = (targetDay + 7 - today.getDay()) % 7 || 7; // Get days until next occurrence
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    return nextDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}