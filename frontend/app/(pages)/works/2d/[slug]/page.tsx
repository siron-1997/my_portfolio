export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <h1>2D Work Page</h1>
      <p>Slug: {slug}</p>
    </div>
  );
}
