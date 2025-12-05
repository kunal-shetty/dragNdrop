import { WebsiteBuilder } from "@/components/builder/website-builder"

export default async function EditorPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params

  return <WebsiteBuilder documentId={documentId} collaborationEnabled={true} />
}
