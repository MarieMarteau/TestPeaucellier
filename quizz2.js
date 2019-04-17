const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const nextButton = document.getElementById('next');
const txtNext = document.getElementById('txtNext');
const clueButton = document.getElementById('indice');
const body = document.getElementsByTagName('body');

const peaucellier = document.getElementById('peaucellier');
const peaucellier2 = document.getElementById('peaucellier2');
const watt = document.getElementById('watt');
const watt2 = document.getElementById('watt2');
const observez = document.getElementById('observez');



const myQuestions = [
  {
    question: "",
    answers: {
      a: "Le parallélogramme de Peaucellier",
      b: "Le dispositif de Watt",
    },
    correctAnswer: "a"
  },  
  ]


function buildQuiz(){
  // we'll need a place to store the HTML output
  const output = [];

  // for each question...
  myQuestions.forEach(
    (currentQuestion, questionNumber) => {

      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for(letter in currentQuestion.answers){

        // ...add an HTML radio button
        answers.push(
          `<label>
		  </br>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> </br>${currentQuestion.question} </div>
        <div class="answers"> ${answers.join('')} </div>`
      );
    }
  );

  // finally combine our output list into one string of HTML and put it on the page
  quizContainer.innerHTML = output.join('');
}

function showResults(){

  // gather answer containers from our quiz
  const answerContainers = quizContainer.querySelectorAll('.answers');

  // keep track of user's answers
  let numCorrect = 0;

  // for each question...
  myQuestions.forEach( (currentQuestion, questionNumber) => {

    // find selected answer
    const answerContainer = answerContainers[questionNumber];
    const selector = 'input[name=question'+questionNumber+']:checked';
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    // if answer is correct
    if(userAnswer===currentQuestion.correctAnswer){
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      answerContainers[questionNumber].style.color = '#009100';
	  
    }
    // if answer is wrong or blank
    else{
      // color the answers red
      answerContainers[questionNumber].style.color = '#D40000';
    }
  });

  // show number of correct answers out of total
  if (numCorrect==myQuestions.length){
	resultsContainer.innerHTML = 'Bravo !';
	
  }
  else if(numCorrect==0){
	  resultsContainer.innerHTML = 'Observez plus attentivement.';
  }
  else{
	 resultsContainer.innerHTML = 'Presque. Observez plus attentivement.';
  }
  
  nextButton.style.visibility='visible';
  txtNext.style.visibility='visible';
  submitButton.style.visibility='hidden';
  clueButton.style.visibility='hidden';

}

function showClue(){
	peaucellier.style.visibility='hidden';
	peaucellier2.style.visibility='visible';
	watt.style.visibility='hidden';
	watt2.style.visibility='visible';
	clueButton.style.visibility='hidden';
	observez.style.visibility='visible';
}

buildQuiz();
submitButton.addEventListener('click', showResults);

clueButton.addEventListener('click', showClue);