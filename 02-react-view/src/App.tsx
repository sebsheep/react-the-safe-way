function Post({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Post title="Hey, I'm learning React" body="This looks great so far" />
      <hr />
    </div>
  );
}

export default App;
