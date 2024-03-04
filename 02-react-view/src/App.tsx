function Post({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-gray-100 p-4 my-4 border rounded">
      <h2 className="text-lg font-bold">{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function App() {
  return (
    <div className="container mx-auto p-4">
      <Post title="Hey, I'm learning React" body="This looks great so far" />
    </div>
  );
}

export default App;
