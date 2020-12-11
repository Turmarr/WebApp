/*
<input id="date" type='date' value="">
<script type="module" src="/static/code.js" defer></script>
<script type="text/javascript">
  let today = new Date().toISOString().substr(0, 10);
  document.querySelector("#date").value = today;
</script>

<script type="text/javascript" getButtons()></script>
*/

const validate = () => {
  const pw = document.querySelector('#pw').value;
  const pwr = document.querySelector('#pwr').value;
  if (pw.length < 4) {
    document.querySelector('#submit').disabled = true;
    document.querySelector('#error').innerHTML = "The password must be at least 4 characters long!"
  } else if (pw !== pwr) {
    document.querySelector('#submit').disabled = true;
    document.querySelector('#error').innerHTML = "The passwords don't match."
  } else {
    document.querySelector('#submit').disabled = false;
    document.querySelector('#error').innerHTML = ""
  }
}