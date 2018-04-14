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
			$('#error').html('');
			if ($('#registration').attr('data-status') === 'on'){
				$('#registration').attr('data-status', 'off');
				$('#check-pass').remove();
				$('#login').val('');
				$('#password').val('');
			}else{
				checkStatus(arraySaved,arraySources);
				validEmailPassword();
				$('#login').val('');
				$('#password').val('');
				$('#country').attr('disabled', true);
			}
		});
		
		$('#registration').click( function(e){
			$('#error').html('');
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
						localStorage.setItem(key,JSON.stringify(arraySaved));
					}else{
						e.target.value = 'on';
						arraySaved.remove(e.target.id);
						localStorage.setItem(key,JSON.stringify(arraySaved));
					}
				}else{
					if ((e.target.tagName === 'BUTTON') && (arraySaved.indexOf(e.target.id) === -1) && ($('#modal')[0].innerText === 'Logout')){
						arraySources[e.target.id].status = 'delete';
						$(`#${e.target.id}`)[0].innerText = 'delete';
						arraySaved.push(e.target.id);
						localStorage.setItem(key,JSON.stringify(arraySaved));
					}else{
						if ((e.target.tagName === 'BUTTON') && (arraySaved.indexOf(e.target.id) !== -1) && ($('#modal')[0].innerText === 'Logout')){
							arraySources[e.target.id].status = 'save';
							$(`#${e.target.id}`)[0].innerText = 'save';
							arraySaved.splice(arraySaved.indexOf(e.target.id), 1);
							localStorage.setItem(key,JSON.stringify(arraySaved));
						}
					}
				}
			}
		});
		
		$('#show-all').click( function(){
			$('.news-bar').empty();
			$('#country').attr('disabled', false);
			checkStatus(arraySaved,arraySources);
			for (var i = 0; i < arraySources.length; i++){
					var newsText = document.createElement('div');
				
					newsText.innerHTML = `<b>"${arrayName[i]}":</b> <br>
									  ${arraySources[i].description} <br><br>
									  <a href='${arraySources[i].url}' target="_blank">
									  ${arraySources[i].url}</a>
									  <button id="${i}" class="saved-news">${arraySources[i].status}</button>`;
					$('.news-bar').append(newsText);
			}
			console.log(arraySaved);
		});
		
		$('#country').change(function(){
			$('.news-bar').empty();
			if ($('#country').val() === ''){
				for (var i = 0; i < arraySources.length; i++){
						
						var newsText = document.createElement('div');
					
						newsText.innerHTML = `<img src="close.png"><b>"${arrayName[i]}":</b> <br>
										  ${arraySources[i].description} <br><br>
										  <a href='${arraySources[i].url}' target="_blank">
										  ${arraySources[i].url}</a>
										  <button id="${i}" class="saved-news">${arraySources[i].status}</button>`;
						$('.news-bar').append(newsText);
				}
			}else{
				for (var i = 0; i < arraySources.length; i++){
					if (arraySources[i].country === $('#country').val()){		
							var newsText = document.createElement('div');
						
							newsText.innerHTML = `<img src="close.png"><b>"${arrayName[i]}":</b> <br>
											  ${arraySources[i].description} <br><br>
											  <a href='${arraySources[i].url}' target="_blank">
											  ${arraySources[i].url}</a>
											  <button id="${i}" class="saved-news">${arraySources[i].status}</button>`;
							$('.news-bar').append(newsText);
					}
				}
			}
		});

		
		$('#saved').click( function(){
			$('#country').attr('disabled', true);
			checkStatus(arraySaved,arraySources);
			renderSaved(arraySaved);
			console.log(arraySaved);
		});
		
	});
	
	var API_KEY = '6dc2f16f1c6245c8ac3b8a6815dc9044';
	var sourcesUrl = 'https://newsapi.org/v2/sources?apiKey=' + API_KEY;
	var key;
			
	var arraySources = [];
	var arrayName = [];
	var arraySaved = [];
	var arrayCountry = [];
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
								  <a href='${arraySources[array[i]].url}' target="_blank">
								  ${arraySources[array[i]].url}</a>
								  <button id="${array[i]}" class="saved-news">${arraySources[array[i]].status}</button>`;
			$('.news-bar').append(newsText);
		}
		
	}
	
	function checkStatus(arraySav, arraySour){
		arraySaved = JSON.parse(localStorage.getItem(key));
		if (arraySav.length !== 0){
			for (var i = 0; i < arraySour.length; i++){
				for (var j = 0; j < arraySav.length; j++){
					if (arraySav[j] == i){
						arraySour[i].status = 'delete';
						break;
					}else{
						arraySour[i].status = 'save';
					}
				}
			}
		}else{
			for (var i = 0; i < arraySour.length; i++){
				arraySour[i].status = 'save';
			}
		}
	}
	
	
	
	function validEmailPassword(){
		
		var reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
		var rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/i;
		var text;
		
		if ((reEmail.test($('#login').val())) && (rePass.test($('#password').val())) && ($('#password-check').val() === $('#password').val() || $('#registration').attr('data-status', 'off'))){
			if ((localStorage.getItem($('#login').val()) === null) && ($('#registration').attr('data-status') === 'on'))	{
				localStorage.setItem($('#login').val(),JSON.stringify(arraySaved));
				text = 'Registration complete! Sign in please!';
			}else{
				if ((localStorage.getItem($('#login').val()) !== null) && ($('#registration').attr('data-status') === 'off')){
					$('#modal-window').animate({opacity: 0,}, 200, function(){ 
            			$(this).css('display', 'none');
            		    $('#overlay').fadeOut(400);
            		});
					text = '';
					arraySaved = JSON.parse(localStorage.getItem($('#login').val()));
					checkStatus(arraySaved,arraySources);
					key = $('#login').val();
					console.log(key);
					$('#modal')[0].innerText = 'Logout';
					$('#saved').css('display', 'flex');
					$('.header-bar').append('<div class="header-buttons" id="saved">Saved</div>');
				}else{
					if ((localStorage.getItem($('#login').val()) !== null) && ($('#registration').attr('data-status') === 'on')){
						text = 'User exists!'
					}else{
						text = 'User absent!';
					}
				}
			}
		}else{
			if ((!reEmail.test($('#login').val())) && (!rePass.test($('#password').val()))) {
				text = 'Invalid Email and Password!';
			}else{
				if(!reEmail.test($('#login').val())){
					text = 'Invalid Email!';
				}else{
					if (!rePass.test($('#password').val())){
						text = 'Invalid Password!';
					}
					else{
						text = 'Passwords not coincidence!';
					}
				}
			}
		}
		$('#error').html(text);
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
			if (arrayCountry.indexOf(sources[i].country) === -1){
				arrayCountry.push(sources[i].country);
			}
		}
		checkStatus(arraySaved,arraySources);
	}
	
	
	$('#input-tag').change(function(){
		$('#country').attr('disabled', true);
		$('.news-bar').empty();
		if ($('#input-tag').val() !== ''){
			if ((arrayTags.indexOf($('#input-tag').val()) === -1) && (arrayName.indexOf($('#input-tag').val()) !== -1)){
				arrayTags.push($('#input-tag').val());
				var div = document.createElement('div');
				var span = document.createElement('span');
				var img = document.createElement('img');
			
				img.src = 'icon.png';
				div.className = 'tag';
				span.innerHTML = `${$('#input-tag').val()}`;
			
				div.appendChild(span);
				div.appendChild(img);
				$('.tags').append(div);
			}
			
			if (arrayName.indexOf($('#input-tag').val()) !== -1 ){
				var newsText = document.createElement('div');
				newsText.innerHTML = `<img src="close.png"><b>"${$('#input-tag').val()}":</b> <br>
									  ${arraySources[arrayName.indexOf($('#input-tag').val())].description} <br><br>
									  <a href='${arraySources[arrayName.indexOf($('#input-tag').val())].url}' target="_blank">
									  ${arraySources[arrayName.indexOf($('#input-tag').val())].url}</a>
									  <button id="${arrayName.indexOf($('#input-tag').val())}" class="saved-news">${arraySources[arrayName.indexOf($('#input-tag').val())].status}</button>`;
				$('.news-bar').append(newsText);
				$('#input-tag').val('');
			}

		}
		return true;
	});
	
	$('.tags').click( function(e){
		if (e.target.tagName === 'SPAN'){
			$('#input-tag').val($(e.target).html());
			$('.news-bar').empty();
			var newsText = document.createElement('div');
				newsText.innerHTML = `<img src="close.png"><b>"${$('#input-tag').val()}":</b> <br>
									  ${arraySources[arrayName.indexOf($('#input-tag').val())].description} <br><br>
									  <a href='${arraySources[arrayName.indexOf($('#input-tag').val())].url}' target="_blank">
									  ${arraySources[arrayName.indexOf($('#input-tag').val())].url}</a>
									  <button id="${arrayName.indexOf($('#input-tag').val())}" class="saved-news">${arraySources[arrayName.indexOf($('#input-tag').val())].status}</button>`;
				$('.news-bar').append(newsText);
		}else{
			if (e.target.tagName === 'IMG'){
				$(e.target).parent().remove();
				arrayTags.splice(arrayTags.indexOf($($(e.target).parent().children()[0]).html()), 1);
			}
		}
	});
	
	$('#input-tag').autocomplete({
		source: arrayName,
		minLength: 0,
		delay: 0
	});
	
	$('#country').autocomplete({
		source: arrayCountry,
		minLength: 0,
		delay: 0
	});
	
})();