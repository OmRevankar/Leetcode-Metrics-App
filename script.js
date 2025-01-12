document.addEventListener("DOMContentLoaded" , function(){

    const searchButton = document.querySelector(".searchButton");
    const searchBar = document.querySelector(".searchBar");
    const easyCircle = document.getElementById("easy");
    const mediumCircle = document.getElementById("medium");
    const hardCircle = document.getElementById("hard");
    const easyCircleData = document.querySelector(".easyLabel");
    const mediumCircleData = document.querySelector(".mediumLabel");
    const hardCircleData = document.querySelector(".hardLabel");
    const contributionContainer = document.querySelector(".contributions");
    const responseSection = document.querySelector(".responseSection");

    function validUsername(username){

        if(username.trim() === "")
        {   alert("Username cannot be empty");
            return false;
        }
        else
        {

            const regex = /^[a-zA-Z0-9](?!.*[-_]{2})[a-zA-Z0-9_-]{2,13}[a-zA-Z0-9]$/;

            if(!regex.test(username))
            {
               alert("Invalid Username");
               return false;
            }
            else
            {
                return true;
            }
        }
    }

    // async function fetchUserData(username){

    //     const url = "https://alfa-leetcode-api.onrender.com/userProfile/:${username}";

    //     try { 

    //         searchButton.textContent = "Searching...";
    //         searchButton.disabled = true;
            
    //         let response = await fetch(url);
            
    //         if(!response.ok)
    //         {   
    //             throw new Error("Unable to fetch User Details")
    //         }
    //         else
    //         {
    //             let data = await response.json();
    //             console.log("Logging Data :",data)
    //         }
        
    //     } 
    //     catch (error) {

    //     }
    //     finally{
    //         searchButton.innerText = "Search";
    //         searchButton.disabled = false;
    //     }

    // }

    async function fetchUserData(username){


        try { 

            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            

            const myHeaders = new Headers();
            myHeaders.append("content-type","application/json");

            const proxyUrl = "https://cors-anywhere.herokuapp.com/";
            const targetUrl = "https://leetcode.com/graphql/";


            //concatenated url = https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/"


            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: {"username":`${username}`}
            })

            const requestOptions = {

                method : "POST",
                body: graphql,
                headers : myHeaders,
                redirect : "follow"

            };
            
            const response = await fetch(proxyUrl+targetUrl,requestOptions);
            
            if(!response.ok)
            {   
                throw new Error("Unable to fetch User Details")
            }
            else
            {
                let parsedData = await response.json();
                console.log("Logging Data :",parsedData);

                calculateData(parsedData);

            }
    
        } 
        catch (error) {
            responseSection.innerHTML = "<p>No Data Found</p>";
        }
        finally{
            searchButton.innerText = "Search";
            searchButton.disabled = false;
        }

    }

    function updateScreen(totalQ,solvedQ,label,circle){

        const percentage = 100*(solvedQ/totalQ)
        label.textContent = `${solvedQ}/${totalQ}`;
        // circle.style.setProperty("--progress-stats",`${percentage}%`);
        circle.style.cssText = `--progress-stats : ${percentage}%`;
    }


    function calculateData(parsedData){
        const totalQuestions = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQuestions = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQuestions = parsedData.data.allQuestionsCount[2].count;
        const totalHardQuestions = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateScreen(totalEasyQuestions,solvedEasyQuestions,easyCircleData,easyCircle);
        updateScreen(totalHardQuestions,solvedHardQuestions,hardCircleData,hardCircle);
        updateScreen(totalMediumQuestions,solvedMediumQuestions,mediumCircleData,mediumCircle);


        const cardsData = [
            {label : "Overall Submissions" , value: parsedData.data.matchedUser.submitStats.acSubmissionNum[0].submissions},
            {label : "Easy Submissions" , value: parsedData.data.matchedUser.submitStats.acSubmissionNum[1].submissions},
            {label : "Medium Submissions" , value: parsedData.data.matchedUser.submitStats.acSubmissionNum[2].submissions},
            {label : "Hard Submissions" , value: parsedData.data.matchedUser.submitStats.acSubmissionNum[3].submissions},
        ]


        contributionContainer.innerHTML = cardsData.map( (num,index)=>{
            return  `<div class="contriCard">
                        <h3>${num.label}</h3>
                        <p>${num.value}</p>
                    </div>`
        } ).join("");

    }


    searchButton.addEventListener("click" , function(){

        const username = searchBar.value;
        if(validUsername(username))
        {
            fetchUserData(username);
        }
        else
        {

        }

    })


})