## END POINTS ARE FOLLOWING ##

	* AUTHENTICATION *
		
		1) SIGNUP : '/auth/signup/' . 
				
				input : {
					useremail: 'example@example.com',
					password : 'example'
				}
				
				output: {
					message:'user created!',
					data: {}
				}

		2) LOGIN : '/auth/login/' . 
				
					input : {
						useremail: 'test@test.com',
						password: 'test'
					}
					
					output : {
						message: 'Login successfully!',
						token: '',
						userId: ''
					}
		3) FORGOT PASSWORD : '/auth/forgotpassword/' . 
				
					input: {
						useremail: 'test@test.com'
					}
					output : {
						message: 'OTP sent',
						status: status
					}
		4) NEW PASSWORD ; '/auth/newpassword/' .
			
					input : {
						useremail: 'test@test.com',
						password: 'test',
						otp: ''
					}
					
					output: {
						message: 'password changed!',
						data: {},
						status: status
					}
					
		
	* MEDIA *
	
		1) UPLOADING VIDEO : '/api/media/upload/' . 
			
				input = file
				
				output : {
					message: 'file uploaded',
					status: status,
					data: 'video file data/path'
				}
			
		2) FETCHING VIDEOS OF LOGINED USER : '/api/media/getmedia/' .
				output : {
					message : 'media found',
					data: video Array,
					status: status
				}
		




		# DATABASE #
		
		Database is mongodb used at localhost.
