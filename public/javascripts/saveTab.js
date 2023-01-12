document.querySelector("#save-tab-button").addEventListener('click', (event) =>{
    const userId = event.target.getAttribute('data-userid');
    saveTab('tab-container', userId);
})
function saveTab(el, userId){
        let saveTabContainer = document.getElementById(el);  //get tab container 
        let innerHTMLTabContainer = saveTabContainer.innerHTML; //get contents of tab container
        if(userId.length === 0){
            document.querySelector("#please-login-alert").classList.remove('d-none');
            setTimeout(function(){
                document.querySelector("#please-login-alert").classList.add('d-none');
            }, 2000);
            clearTimeout(timeoutId)

        } else {
            fetch('/saveTab', {   
                method: 'POST',
                body: JSON.stringify({ userId: userId, tabs: innerHTMLTabContainer}),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            document.querySelector("#successful-save-alert").classList.remove('d-none');
            setTimeout(function(){
                document.querySelector("#successful-save-alert").classList.add('d-none');
            }, 2000);
            clearTimeout(timeoutId)}
}