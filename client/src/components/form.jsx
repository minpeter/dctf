export default (props) => {
  const { children, onSubmit, disabled, buttonText, errors } = props;

  return (
    <form onSubmit={onSubmit} class={props.class}>
      {[].concat(children).map((input) => {
        if (input.props === undefined) {
          return;
        }
        if (!input.props.name) {
          return input;
        }
        let { icon, error, name } = input.props;

        if (errors !== undefined && name !== undefined)
          error = error || errors[name];
        const hasError = error !== undefined;

        input.props.class += " input-contains-icon";
        if (hasError) {
          input.props.class += " input-error";
        }
        return (
          <div class="form-section" key={name}>
            {hasError && (
              <label class="text-danger info font-light">{error}</label>
            )}
            <div class={`  input-control`}>
              {input}
              <span class="icon">
                {icon !== undefined && <div class={`icon  `}>{icon}</div>}
              </span>
            </div>
          </div>
        );
      })}
      <button
        disabled={disabled}
        class={`  btn-info u-center`}
        name="btn"
        value="submit"
        type="submit"
      >
        {buttonText}
      </button>
      <span class="fg-danger info" />
    </form>
  );
};
