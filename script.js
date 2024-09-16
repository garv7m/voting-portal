document.getElementById('addQuestionBtn').addEventListener('click', function() {
    const questionText = document.getElementById('question').value;
    const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value
    ];

    if (questionText && options.every(option => option)) {
        addQuestion(questionText, options);
        clearInputs();
    } else {
        alert('Please fill in all fields');
    }
});

let questions = [];

function addQuestion(question, options) {
    const questionData = {
        question: question,
        options: options.map(option => ({ name: option, votes: 0 })),
    };
    questions.push(questionData);

    const questionsList = document.getElementById('questionsList');
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionTitle = document.createElement('h3');
    questionTitle.innerText = question;
    questionDiv.appendChild(questionTitle);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');

    options.forEach((option, index) => {
        const optionLabel = document.createElement('label');
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = question; // Group by question
        optionInput.value = index; // Store index to identify which option was voted for
        
        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(option));
        optionsDiv.appendChild(optionLabel);
    });

    const voteButton = document.createElement('button');
    voteButton.innerText = 'Vote';
    voteButton.addEventListener('click', function() {
        const selectedOption = optionsDiv.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            const optionIndex = parseInt(selectedOption.value);
            questionData.options[optionIndex].votes++;
            updateChart(questionData);
            alert(`You voted for: ${questionData.options[optionIndex].name}`);
        } else {
            alert('Please select an option to vote');
        }
    });

    questionDiv.appendChild(optionsDiv);
    questionDiv.appendChild(voteButton);
    questionsList.appendChild(questionDiv);
}

function updateChart(questionData) {
    const voteChart = document.getElementById('voteChart');
    voteChart.style.display = 'block'; // Show the chart

    const ctx = voteChart.getContext('2d');
    const labels = questionData.options.map(option => option.name);
    const data = questionData.options.map(option => option.votes);

    if (window.votePieChart) {
        window.votePieChart.destroy(); // Destroy previous chart instance
    }

    window.votePieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vote Count',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: questionData.question
                }
            }
        }
    });
}

function clearInputs() {
    document.getElementById('question').value = '';
    document.getElementById('option1').value = '';
    document.getElementById('option2').value = '';
    document.getElementById('option3').value = '';
    document.getElementById('option4').value = '';
}