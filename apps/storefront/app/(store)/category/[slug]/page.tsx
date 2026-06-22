import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/collections/${slug}`);
}
