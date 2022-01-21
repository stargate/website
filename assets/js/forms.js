function loadMarketoScript(url, callback, errorCallback) {
  var script = document.createElement("script");
  script.onload = callback;
  script.onerror = errorCallback;
  script.src = url;

  document.head.appendChild(script);
}

function onErrorLoadingForm($wrapper) {
  if ($wrapper) {
    $wrapper.style.display = "none";
  }
}

function loadForm($form, id, callback) {
  try {
    MktoForms2.loadForm("//pages.datastax.com", "259-IFZ-779", id, callback);
  } catch (error) {
    onErrorLoadingForm($form);
  }
}

function loadNewsletterForm() {
  var $newsletterForm = document.querySelector("form[newsletter-form]");
  var newsletterFormId = 4188;

  function onFormLoaded(form) {
    $newsletterForm.style.display = "block";
    $newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var firstName = document.querySelector(
        "form[newsletter-form] input#firstName"
      ).value;
      var lastName = document.querySelector(
        "form[newsletter-form] input#lastName"
      ).value;
      var email = document.querySelector(
        "form[newsletter-form] input#email"
      ).value;

      form.setValues({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
      });

      var validation = form.validate();

      if (validation) {
        form.submit();
      }

      if (!validation) {
        const $message = document.querySelector(".newsletter-form-message");
        $message.style.display = "block";
        $message.innerHTML =
          "<strong>Error</strong><br>Please fill all the required fields and try again.";
      }
    });

    form.onSuccess(function (values, followUpUrl) {
      const $message = document.querySelector(".newsletter-form-message");
      $newsletterForm.style.display = "none";
      $message.style.display = "block";
      $message.innerHTML = "<strong>Thanks!</strong><br>Thanks for signing up.";
      return false;
    });
  }

  function onLoadSuccess() {
    loadForm($newsletterForm, newsletterFormId, onFormLoaded);
  }

  function onLoadError() {
    onErrorLoadingForm($newsletterForm);
  }

  setTimeout(() => {
    if (window.MktoForms2) {
      onLoadSuccess();
      return;
    }

    if (
      document.querySelectorAll('script[src*="pages.datastax.com/js/forms2"]')
        .length === 0
    ) {
      loadMarketoScript(
        "//pages.datastax.com/js/forms2/js/forms2.min.js",
        onLoadSuccess,
        onLoadError
      );
      return;
    }

    onLoadError();
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  loadNewsletterForm();
});
