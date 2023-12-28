import Form from "../components/form";
import useRecaptcha from "../components/recaptcha";
import config from "../config";
import { register } from "../api/auth";
import UserCircle from "../icons/user-circle.svg";
import { useEffect, useState, useCallback } from "preact/hooks";

export default ({ githubToken, githubName }) => {
  const [disabledButton, setDisabledButton] = useState(false);
  const division = config.defaultDivision || Object.keys(config.divisions)[0];
  const [showName, setShowName] = useState(false);

  const [name, setName] = useState(githubName);
  const handleNameChange = useCallback((e) => setName(e.target.value), []);

  const [errors, setErrors] = useState({});
  const requestRecaptchaCode = useRecaptcha("register");

  const handleRegister = useCallback(async () => {
    setDisabledButton(true);

    const { errors } = await register({
      githubToken,
      name: name || undefined,
      division,
      recaptchaCode: await requestRecaptchaCode?.(),
    });
    setDisabledButton(false);

    if (!errors) {
      return;
    }
    if (errors.name) {
      setShowName(true);
    }

    setErrors(errors);
  }, [githubToken, name, division, requestRecaptchaCode]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      handleRegister();
    },
    [handleRegister]
  );

  // Try login with Github token only, if fails prompt for name
  useEffect(handleRegister, []);

  return (
    <div class="row u-center">
      <Form
        class={` col-6`}
        onSubmit={handleSubmit}
        disabled={disabledButton}
        errors={errors}
        buttonText="Register"
      >
        {showName && (
          <input
            autofocus
            required
            autocomplete="username"
            autocorrect="off"
            icon={<img src={UserCircle} style={{ filter: "invert(1)" }} />}
            name="name"
            maxLength="64"
            minLength="2"
            placeholder="Team Name"
            type="text"
            value={name}
            onChange={handleNameChange}
          />
        )}
      </Form>
    </div>
  );
};
