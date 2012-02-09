<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Smart Wizard 2 - a javascript jQuery wizard control plugin</title>
<link href="styles/demo_style.css" rel="stylesheet" type="text/css">

<link href="styles/smart_wizard.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/jquery.smartWizard-2.0.js"></script>

<script type="text/javascript">
   
    $(document).ready(function(){
    	// Smart Wizard    	
  		$('#wizard').smartWizard({transitionEffect:'slideleft',onLeaveStep:leaveAStep,onShowStep:showAStep});
      function showAStep(obj){
        if(window.console) {      
          console.debug("Show Step");
          console.debug(obj);
        }
        return true;
      }
      function leaveAStep(obj){
        if(window.console) {      
          console.debug("Leave Step");
          console.debug(obj);
        }
        return true;
      }      
		});
</script>
</head><body>

<!-- Tabs -->
  		<div id="wizard" class="swMain">
  			<ul>
  				<li><a href="#step-1">
                <span class="stepNumber">1</span>
                <h2>Account Details<br />
                <small>Fill your account details</small></h2>
            </a></li>
  				<li><a href="#step-2">
                <span class="stepNumber">2</span>
                <h2>Profile Details<br />
                <small>Fill your profile details</small></h2>
            </a></li>
  				<li><a href="#step-3">
                <span class="stepNumber">3</span>
                <h2>Contact Details<br />
                <small>Fill your contact details</small></h2>
             </a></li>
  				<li><a href="#step-4">
                <span class="stepNumber">4</span>
                <h2>Other Details<br />
                <small>Fill some other details</small></h2>
            </a></li>
  			</ul>
  			<div id="step-1">	
            <h2 class="StepTitle">Step 1: Account Details</h2>
            <table cellspacing="3" cellpadding="3" align="center">
          			<tr>
                    	<td align="center" colspan="3">&nbsp;</td>
          			</tr>        
          			<tr>
                    	<td align="right">Username :</td>
                    	<td align="left">
                    	  <input type="text" id="username" name="username" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_username"></span>&nbsp;</td>
          			</tr>
          			<tr>
                    	<td align="right">Password :</td>
                    	<td align="left">
                    	  <input type="password" id="password" name="password" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_password"></span>&nbsp;</td>
          			</tr> 
                <tr>
                    	<td align="right">Confirm Password :</td>
                    	<td align="left">
                    	  <input type="password" id="cpassword" name="cpassword" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_cpassword"></span>&nbsp;</td>
          			</tr>                                   			
  			   </table>          			
        </div>
  			<div id="step-2">
            <h2 class="StepTitle">Step 2: Profile Details</h2>	
            <table cellspacing="3" cellpadding="3" align="center">
          			<tr>
                    	<td align="center" colspan="3">&nbsp;</td>
          			</tr>        
          			<tr>
                    	<td align="right">First Name :</td>
                    	<td align="left">
                    	  <input type="text" id="firstname" name="firstname" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_firstname"></span>&nbsp;</td>
          			</tr>
          			<tr>
                    	<td align="right">Last Name :</td>
                    	<td align="left">
                    	  <input type="text" id="lastname" name="lastname" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_lastname"></span>&nbsp;</td>
          			</tr> 
          			<tr>
                    	<td align="right">Gender :</td>
                    	<td align="left">
                        <select id="gender" name="gender" class="txtBox">
                          <option value="">-select-</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>                 
                        </select>
                      </td>
                    	<td align="left"><span id="msg_gender"></span>&nbsp;</td>
          			</tr>                                   			
  			   </table>        
        </div>                      
  			<div id="step-3">
            <h2 class="StepTitle">Step 3: Contact Details</h2>	
            <table cellspacing="3" cellpadding="3" align="center">
          			<tr>
                    	<td align="center" colspan="3">&nbsp;</td>
          			</tr>        
          			<tr>
                    	<td align="right">Email :</td>
                    	<td align="left">
                    	  <input type="text" id="email" name="email" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_email"></span>&nbsp;</td>
          			</tr>
          			<tr>
                    	<td align="right">Phone :</td>
                    	<td align="left">
                    	  <input type="text" id="phone" name="phone" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_phone"></span>&nbsp;</td>
          			</tr>          			
          			<tr>
                    	<td align="right">Address :</td>
                    	<td align="left">
                            <textarea name="address" id="address" class="txtBox" rows="3"></textarea>
                      </td>
                    	<td align="left"><span id="msg_address"></span>&nbsp;</td>
          			</tr>                                   			
  			   </table>               				          
        </div>
  			<div id="step-4">
            <h2 class="StepTitle">Step 4: Other Details</h2>	
            <table cellspacing="3" cellpadding="3" align="center">
          			<tr>
                    	<td align="center" colspan="3">&nbsp;</td>
          			</tr>        
          			<tr>
                    	<td align="right">Hobbies :</td>
                    	<td align="left">
                    	  <input type="text" id="phone" name="phone" value="" class="txtBox">
                      </td>
                    	<td align="left"><span id="msg_phone"></span>&nbsp;</td>
          			</tr>          			
          			<tr>
                    	<td align="right">About You :</td>
                    	<td align="left">
                            <textarea name="address" id="address" class="txtBox" rows="5"></textarea>
                      </td>
                    	<td align="left"><span id="msg_address"></span>&nbsp;</td>
          			</tr>                                   			
  			   </table>                 			
        </div>
  		</div>
</body>
</html>
