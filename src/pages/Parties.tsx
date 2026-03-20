import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getParties, addParty, uid, type Party } from "@/lib/storage";
import { ArrowLeft, Eye, Plus, Users } from "lucide-react";
import { toast } from "sonner";

const Parties = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [parties, setParties] = useState(getParties);

  const refresh = () => setParties(getParties());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Enter party name"); return; }
    addParty(name.trim());
    toast.success(`Party "${name.trim()}" added!`);
    setName("");
    refresh();
  };

  return (
    <div className="p-4 space-y-5">
      <header className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate("/")} className="text-muted-foreground"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">👥 Parties</h1>
      </header>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Add new party name"
          className="text-base h-12 flex-1"
        />
        <Button type="submit" className="h-12 px-4 rounded-xl"><Plus size={20} /></Button>
      </form>

      {parties.length === 0 ? (
        <div className="result-highlight">
          <Users className="mx-auto text-muted-foreground mb-2" size={32} />
          <p className="text-muted-foreground">No parties yet. Add one above or they'll be auto-added when you buy/sell.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {parties.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-4">
              <p className="font-semibold">{p.name}</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg gap-1.5"
                onClick={() => navigate(`/party/${encodeURIComponent(p.name)}`)}
              >
                <Eye size={16} /> View
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Parties;
