(function(){
	
	$(document).ready(function() {
    	$('#modal').click( function(event){
			if ($('#modal')[0].innerText === 'Login'){
				event.preventDefault();
				$('#overlay').fadeIn(400, function(){ 
            	    $('#modal-window').css('display', 'flex').animate({opacity: 1}, 200);
        		});
			}else{
				$('#modal')[0].innerText = 'Login';
				arraySaved = [];
				$('#saved').css('display', 'none');
				key = '';
				$('.news-bar').empty();
			}
    	});
 
		$('#modal-close, #overlay').click( function(){
			$('#modal-window').animate({opacity: 0,}, 200, function(){ 
            	$(this).css('display', 'none');
                $('#overlay').fadeOut(400);
            });
    	});
		
		$('#sign-in').click( function(e){
			if ($('#registration').attr('data-status') === 'on'){
				$('#registration').attr('data-status', 'off');
				$('#check-pass').remove();
				$('#login').val('');
				$('#password').val('');
			}else{
				validEmailPassword();
				arraySaved = JSON.parse(localStorage.getItem(key));
				$('#login').val('');
				$('#password').val('');
			}
		});
		
		$('#registration').click( function(e){
			var statusRegistrationButton = $('#registration').attr('data-status');
			if (statusRegistrationButton === 'off'){
				var div = document.createElement('div');
				div.className = 'password-bar';
				div.setAttribute('id', 'check-pass');
				div.innerHTML = '<input id="password-check" type="password" placeholder="repeat pass"><img id="check-password-check" src="checkpassword.png">';
				$('.password-bar').after(div);
				$('#registration').attr('data-status', 'on');
				$('#login').val('');
				$('#password').val('');
			}else{
				validEmailPassword();
			}
		});
		
		$('#check-password-check').click( function(){
			console.log('asd');
			if ($('#password-check').attr('type') === 'password'){
				$('#password-check').attr('type', 'text');
			}else{
				$('#password-check').attr('type', 'password');
			}
		});
		
		$('#check-password').click( function(){
			if ($('#password').attr('type') === 'password'){
				$('#password').attr('type', 'text');
			}else{
				$('#password').attr('type', 'password');
			}
		});
		
		$('.news-bar').click( function(e){
			if (e.target.tagName === 'IMG'){
				$(e.target.parentNode).remove();
			}else{
				if (e.target.tagName === 'INPUT'){
					if ((e.target.value === 'on') && !(e.target.id in arraySaved)){
						e.target.value = 'off';
						arraySaved.push(e.target.id);
					}else{
						e.target.value = 'on';
						arraySaved.remove(e.target.id);
					}
				}
			}
		});
		
		$('#show-all').click( function(){
			$('.news-bar').empty();
			for (var i = 0; i < arraySources.length; i++){
				if (arraySaved.indexOf(i) != -1){
					console.log(arraySaved);
					
					var newsText = document.createElement('div');
				
					newsText.innerHTML = `<img src="close.png"><b>"${arrayName[i]}":</b> <br>
									  ${arraySources[i].description} <br><br>
									  <a href='${arraySources[i].url}' target="_blank">
									  ${arraySources[i].url}</a>
									  <input type="checkbox" id="${i}" checked class="saved-news">`;
					$('.news-bar').append(newsText);
				}else{
					var newsText = document.createElement('div');
				
					newsText.innerHTML = `<img src="close.png"><b>"${arrayName[i]}":</b> <br>
									  ${arraySources[i].description} <br><br>
									  <a href='${arraySources[i].url}' target="_blank">
									  ${arraySources[i].url}</a>
									  <input type="checkbox" id="${i}" class="saved-news">`;
					$('.news-bar').append(newsText);
				}
			}
		});

		
		$('#saved').click( function(){
			arraySaved = JSON.parse(localStorage.getItem(key));
			renderSaved(arraySaved);
		});
		
		$('#save').click( function(){
			if ($('.news-bar > div').size() > 1){
				arraySaved = [];
				for (var i = 0; i < arraySources.length; i++){
					if ($(`#${i}`).is(':checked')){
						arraySaved.push(i);
					}
				}
			}else{
				for (var i = 0; i < arraySources.length; i++){
					if (($(`#${i}`).is(':checked')) && (arraySaved.indexOf(i) === -1)){
						arraySaved.push(i);	
					}
				}
			}
			localStorage.setItem(key,JSON.stringify(arraySaved));
		});
		
	});
	
	var login = document.getElementById('login');
	var password = document.getElementById('password');
	var sign = document.getElementsByClassName('sign')[0];
	var input = document.getElementById('input-tag');
	var find = document.getElementById('find');
	var removeTags = document.getElementById('remove');
	var tags = document.getElementsByClassName('tags')[0];
	var signIn = document.getElementById('sign-in');
	var API_KEY = '6dc2f16f1c6245c8ac3b8a6815dc9044';
	var sourcesUrl = 'https://newsapi.org/v2/sources?apiKey=' + API_KEY;
	var key;
			
	var arraySources = [];
	var arrayName = [];
	var arraySaved = [];
	var arrayTags = [];
	
	
	Array.prototype.remove = function(x) { 
    	var i;
    	for(i in this){
			if(this[i].toString() == x.toString()){
				this.splice(i,1)
			}
		}
	}
	
	function renderSaved(array){
		
		$('.news-bar').empty();
		
		for (var i = 0; i < array.length; i++){
			var newsText = document.createElement('div');
			newsText.innerHTML = `<img src="close.png"><b>"${arraySources[array[i]].name}":</b> <br>
								  ${arraySources[array[i]].description} <br><br>
								  <a href='${array[i].url}' target="_blank">
								  ${arraySources[array[i]].url}</a>
								  <input type="checkbox" id="${array[i]}" checked class="saved-news">`;
			$('.news-bar').append(newsText);
		}
		
	}
	
	function validEmailPassword(){
		
		var reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
		var rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/i;
		var text;
		
		if ((reEmail.test(login.value)) && (rePass.test(password.value)) && ($('#password-check').val() === $('#password').val() || $('#registration').attr('data-status', 'off'))){
			if ((localStorage.getItem(login.value) === null) && ($('#registration').attr('data-status') === 'on'))	{
				console.log(arraySaved);
				localStorage.setItem(login.value,JSON.stringify(arraySaved));
				text = 'Registration complete! Sign in please!';
			}else{
				if ((localStorage.getItem(login.value) !== null) && ($('#registration').attr('data-status') === 'off')){
					$('#modal-window').animate({opacity: 0,}, 200, function(){ 
            			$(this).css('display', 'none');
            		    $('#overlay').fadeOut(400);
            		});
					text = '';
					savedArray = JSON.parse(localStorage.getItem(login.value));
					key = login.value;
					console.log(key);
					$('#modal')[0].innerText = 'Logout';
					$('#saved').css('display', 'flex');
					$('.header-bar').append('<div class="header-buttons" id="saved">Saved</div>');
				}else{
					if ((localStorage.getItem(login.value) !== null) && ($('#registration').attr('data-status') === 'on')){
						text = 'User exists!'
					}else{
						text = 'User absent!';
					}
				}
			}
		}else{
			if ((!reEmail.test(login.value)) && (!rePass.test(password.value))) {
				text = 'Invalid Email and Password!';
			}else{
				if(!reEmail.test(login.value)){
					text = 'Invalid Email!';
				}else{
					if (!rePass.test(password.value)){
						text = 'Invalid Password!';
					}
					else{
						text = 'Passwords not coincidence!';
					}
				}
			}
		}
		var error = document.getElementById('error');
		error.innerHTML = text;
	}
	
	
	
	var sourcesXhr = new XMLHttpRequest();
	
	sourcesXhr.open('GET', sourcesUrl);
	sourcesXhr.send();
	
	sourcesXhr.onreadystatechange = function(){
		if(sourcesXhr.readyState !== 4){
			return;
		}
		
		renderNews();
	}
	
	function renderNews(){
		var sources = JSON.parse(sourcesXhr.response).sources;
		for (var i = 0,len = sources.length;i < len; i++){
			arraySources[i] = sources[i];
			arrayName[i] = sources[i].name;
		}
	}
	
	
	find.addEventListener('click', function(){
		$('.news-bar').empty();
		if (input.value !== ''){
			if (arrayTags.indexOf(input.value) === -1){
				arrayTags.push(input.value);
				var div = document.createElement('div');
				var span = document.createElement('span');
				var img = document.createElement('img');
			
				img.src = 'icon.png';
				div.className = 'tag';
				span.innerHTML = `${input.value}`;
			
				div.appendChild(span);
				div.appendChild(img);
				tags.appendChild(div);
			}
			
			if (arrayName.indexOf(input.value) !== -1 ){
				var newsText = document.createElement('div');
				newsText.innerHTML = `<img src="close.png"><b>"${input.value}":</b> <br>
									  ${arraySources[arrayName.indexOf(input.value)].description} <br><br>
									  <a href='${arraySources[arrayName.indexOf(input.value)].url}' target="_blank">
									  ${arraySources[arrayName.indexOf(input.value)].url}</a>
									  <input type="checkbox" id="${arrayName.indexOf(input.value)}" class="saved-news">`;
				$('.news-bar').append(newsText);
				input.value = '';
			}

		}
	});
	
	removeTags.addEventListener('click',function(){
		tags.innerHTML = '';
		arrayTags = [];
	})
	
	tags.addEventListener('click', function(e){
		if (e.target.tagName === 'SPAN'){
			input.value = e.target.innerHTML;
		}else{
			if (e.target.tagName === 'IMG')
				tags.removeChild(e.target.parentNode);
		}
	});
	
	$('#input-tag').autocomplete({
		source: arrayName,
		minLength: 0,
		delay: 0
	});
	
	
	
	
	
})();