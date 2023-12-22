export default function ActionButton({ ...rest }) {
  return (
    <div class="row u-center">
      <a class={classes.button} {...rest} />
    </div>
  );
}
