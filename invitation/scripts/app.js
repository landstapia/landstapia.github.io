$(document).ready(function() {
    const config = {
        "Prayer Meeting": {
            days: [3, 4], 
            batches: [
                { name: "Wednesday Batch 1", type: "Live", time: "4:30 AM", assembly: "3:30 AM" },
                { name: "Wednesday Batch 2", type: "Viewing", time: "8:30 AM", assembly: "7:30 AM" },
                { name: "Wednesday Batch 3", type: "Viewing", time: "6:00 PM", assembly: "5:00 PM" },
                { name: "Thursday Batch 1", type: "Viewing", time: "2:30 PM", assembly: "1:30 PM" },
                { name: "Thursday Batch 2", type: "Viewing", time: "8:00 PM", assembly: "7:00 PM" }
            ]
        },
        "Worship Service": {
            days: [6, 0], 
            batches: [
                { name: "Saturday Batch 1", type: "Live", time: "4:30 AM", assembly: "3:30 AM" },
                { name: "Saturday Batch 2", type: "Viewing", time: "8:30 AM", assembly: "7:30 AM" },
                { name: "Saturday Batch 3", type: "Viewing", time: "12:30 PM", assembly: "11:30 AM" },
                { name: "Sunday Batch 1", type: "Viewing", time: "2:30 PM", assembly: "1:30 PM" },
                { name: "Sunday Batch 2", type: "Viewing", time: "7:00 PM", assembly: "6:00 PM" }
            ]
        },
        "Thanksgiving of God's People": {
            days: [6, 0],
            batches: [
                { name: "Saturday Batch", type: "Live", time: "5:00 PM", assembly: "4:00 PM" },
                { name: "Sunday Batch 1", type: "Viewing", time: "6:00 AM", assembly: "5:00 AM" },
                { name: "Sunday Batch 2", type: "Viewing", time: "6:30 PM", assembly: "5:30 PM" }
            ]
        },
        "Lord's Supper": { days: null, batches: [] },
        "Christian New Year": { days: null, batches: [] },
        "Glorious Thanksgiving": { days: null, batches: [] },
        "Mass Indoctrination": { days: null, batches: [] },
        "Mass Baptism": { days: null, batches: [] },
        "Tanging Pulong Panalangin": { days: null, batches: [] }
    };

    const today = new Date().toISOString().split('T')[0];
    $('#serviceDate').val(today);

    function updateBatches() {
        const service = $('#serviceType').val();
        const $batchSelect = $('#batchSelect');
        const hasBatches = config[service].batches?.length > 0;

        $batchSelect.empty();
        if (hasBatches) {
            config[service].batches.forEach((b, i) => {
                $batchSelect.append(`<option value="${i}">${b.name} (${b.time}) - ${b.type}</option>`);
            });
            $('#isSpecial').prop('checked', false);
        } else {
            $('#isSpecial').prop('checked', true);
        }
        toggleSpecial();
    }

    function toggleSpecial() {
        const isChecked = $('#isSpecial').is(':checked');
        $('#regularSection').toggle(!isChecked);
        $('#specialSection').toggle(isChecked);
    }

    function validateDate() {
        const service = $('#serviceType').val();
        const dateVal = $('#serviceDate').val();
        const allowedDays = config[service].days;

        if (!dateVal || !allowedDays) {
            $('#dateError').hide();
            $('#serviceDate').removeClass('is-danger');
            return;
        }

        const selectedDay = new Date(dateVal).getUTCDay();
        const isValid = allowedDays.includes(selectedDay);

        $('#dateError').toggle(!isValid);
        $('#serviceDate').toggleClass('is-danger', !isValid);
    }

    function generate() {
        const service = $('#serviceType').val();
        const dateVal = $('#serviceDate').val();
        const isSpecial = $('#isSpecial').is(':checked');
        const rawText = $('#rawInvite').val();

        let fTime, fAssembly, fType;

        if (isSpecial) {
            fTime = $('#customTime').val() || "TBD";
            fAssembly = $('#customAssembly').val();
            fType = "Special";
        } else {
            const b = config[service].batches[$('#batchSelect').val()];
            fTime = b.time;
            fAssembly = b.assembly;
            fType = b.type;
        }

        const dateObj = dateVal ? new Date(dateVal) : new Date();
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        const id = (rawText.match(/Meeting ID:\s*([\d\s]+)/) || [0, "---"])[1].trim();
        const pass = (rawText.match(/Passcode:\s*(\w+)/) || [0, "---"])[1];
        const link = (rawText.match(/https:\/\/mcgi-org\.zoom\.us\/j\/\S+/) || ["---"])[0];

        const result = `${service.toUpperCase()}
${dateStr} | ${fTime} (${fType})

${fAssembly ? `Assembly Time: ${fAssembly}` : ""}

📍Maaari lamang po na sumunod sa mga patakaran na ito bago dumalo sa ating mga pagkakatipon.

1. Ikaw po ay nasa TAKDANG ORAS.
2. Ang iyong CAMERA ay BUKAS.
3. Ikaw ay nasa GITNA ng iyong CAMERA SCREEN.
4. Magsuot ng ANGKOP NA GAYAK para sa pagkakatipon.
5. Ikaw po ay NAKATUTOK sa pakikinig.

1 Timoteo 1:5

--

Meeting ID: ${id}
Passcode: ${pass}
Link: ${link}`;

        navigator.clipboard.writeText(result.trim()).then(() => {
            $('#toast').addClass('show');
            setTimeout(() => $('#toast').removeClass('show'), 3000);
        });
    }

    $('#serviceType').on('change', () => { updateBatches(); validateDate(); });
    $('#serviceDate').on('change', validateDate);
    $('#isSpecial').on('change', toggleSpecial);
    $('#btnGenerate').on('click', generate);

    updateBatches();
});