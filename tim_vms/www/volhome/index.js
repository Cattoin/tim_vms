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
    postRSVP("Yes", date, email);
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
        postRSVP("No", date, email, reason);
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

async function postRSVP(response, date, email, reason = null) {
    const data = {
        rsvp_status: response,
        date: date,
        volunteer: email
    };

    if (reason) {
        data.reason = reason;
    }

    try {
        const res = await fetch('api/resource/RSVP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('RSVP submitted successfully:', await res.json());
    } catch (error) {
        console.error('Error submitting RSVP:', error);
    }
}