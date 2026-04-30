import { Badge, Button, Card, IconButton, Input, Select, Textarea } from "@/components/ui";

export default function DevUiPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <Badge variant="accent">UI Primitive Preview</Badge>
        <h1 className="text-3xl font-semibold">Design Token Validation Surface</h1>
      </header>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <IconButton aria-label="Icon action">+</IconButton>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Inputs</h2>
        <Input placeholder="Name" />
        <Select defaultValue="research">
          <option value="research">Research</option>
          <option value="writing">Writing</option>
          <option value="impact">Impact</option>
        </Select>
        <Textarea placeholder="Message" />
      </Card>
    </main>
  );
}
