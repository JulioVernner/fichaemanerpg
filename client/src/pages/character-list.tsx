import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, User, Calendar, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Character } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CharacterList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCharacterName, setNewCharacterName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch characters
  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ['/api/characters'],
  });

  // Create character mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiRequest("POST", "/api/characters", { name });
    },
    onSuccess: (character: Character) => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      setNewCharacterName("");
      setShowCreateForm(false);
      toast({
        title: "Personagem criado",
        description: `${character.name} foi criado com sucesso.`,
      });
      setLocation(`/character/${character.id}`);
    },
    onError: () => {
      toast({
        title: "Erro ao criar personagem",
        description: "Não foi possível criar o personagem.",
        variant: "destructive",
      });
    },
  });

  // Delete character mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/characters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      toast({
        title: "Personagem excluído",
        description: "O personagem foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir personagem",
        description: "Não foi possível excluir o personagem.",
        variant: "destructive",
      });
    },
  });

  const handleCreateCharacter = () => {
    if (newCharacterName.trim()) {
      createMutation.mutate(newCharacterName.trim());
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Data não disponível';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando personagens...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Personagens do Grupo</h1>
                <p className="text-slate-600">Amanae — Filhos de Kaos RPG</p>
              </div>
              <Badge variant="secondary" className="text-sm">Ver 8.0</Badge>
            </div>
            
            {!showCreateForm ? (
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="w-full sm:w-auto"
                data-testid="button-new-character"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Personagem
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="character-name">Nome do Personagem</Label>
                  <Input
                    id="character-name"
                    value={newCharacterName}
                    onChange={(e) => setNewCharacterName(e.target.value)}
                    placeholder="Digite o nome do personagem..."
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCharacter()}
                    data-testid="input-character-name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateCharacter}
                    disabled={!newCharacterName.trim() || createMutation.isPending}
                    data-testid="button-create-character"
                  >
                    {createMutation.isPending ? "Criando..." : "Criar"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCharacterName("");
                    }}
                    data-testid="button-cancel-create"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Characters Grid */}
        {characters.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum personagem criado</h3>
              <p className="text-slate-500 mb-4">
                Crie seu primeiro personagem para começar a jogar
              </p>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-first">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Personagem
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <Card 
                key={character.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setLocation(`/character/${character.id}`)}
                data-testid={`card-character-${character.id}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {character.name || "Sem nome"}
                    </CardTitle>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`button-delete-${character.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir personagem</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{character.name || 'Sem nome'}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(character.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {character.race && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Raça:</span>
                        <span className="font-medium">{character.race}</span>
                      </div>
                    )}
                    {character.characterClass && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Classe:</span>
                        <span className="font-medium">{character.characterClass}</span>
                      </div>
                    )}
                    {character.level && character.level > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Nível:</span>
                        <span className="font-medium">{character.level}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 mt-4 border-t border-slate-200">
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(character.updatedAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}