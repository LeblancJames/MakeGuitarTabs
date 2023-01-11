function saveTab(el, userId){
    if(userId.length === 0){
        return;
    } else {
        let saveTabContainer = document.getElementById(el);
        let innerHTMLTabContainer = saveTabContainer.innerHTML;
        
        fetch('/saveTab', {
            method: 'POST',
            body: JSON.stringify({ userId: userId, tabs: innerHTMLTabContainer }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
    }
  
}

