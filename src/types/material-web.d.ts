declare module "@material/web/*" {
  const content: any;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    "md-filled-text-field": any;
    "md-filled-button": any;
    "md-outlined-button": any;
    "md-dialog": any;
    "md-text-button": any;
  }
}
