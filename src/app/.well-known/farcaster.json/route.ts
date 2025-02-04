export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjM1MDkxMSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJGREVmM0Y0NzBlQ2QyQmM5YTk3NzU2OEM0M0FEMzg2MGMxNjExRDgifQ",
      payload: "eyJkb21haW4iOiJjb21wdS1wcml2eS1mcmFtZS52ZXJjZWwuYXBwIn0",
      signature:
        "MHhlMDYxZTFhYzZiZTRkNmNhODAyODAwZTZmNWVlNjZmZGE2NzIwZjU1YTEyZjQxYmNkMWExMjg3NDYwODllOWMyMWJjNTI5YTlmYjI5YjgwYzkwYmY5OWY1NWQ0MzdkZTllZmY4Y2Q1NjUyMWI3ZWVjMWQwN2JlZWYwODJjZjNhZjFj",
    },
    frame: {
      version: "1",
      name: "Privy Frames V2 Demo",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: `${appUrl}`,
      imageUrl: `${appUrl}/icon.png`,
      buttonTitle: "Yoink with an embedded wallet!",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#5B4FFF",
    },
  };

  return Response.json(config);
}
