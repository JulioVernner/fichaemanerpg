import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCharacterSchema, type Character, type InsertCharacter } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
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

interface CharacterSheetProps {
  characterId: string;
}

export default function CharacterSheet({ characterId }: CharacterSheetProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch character data
  const { data: character, isLoading, error } = useQuery({
    queryKey: ['/api/characters', characterId],
    retry: false,
  });

  // Form setup
  const form = useForm<InsertCharacter>({
    resolver: zodResolver(insertCharacterSchema),
    defaultValues: {
      name: "",
      age: 0,
      height: "",
      weight: "",
      experience: 0,
      level: 1,
      race: "",
      characterClass: "",
      vocation: "",
      pact: "",
      currentHealth: 0,
      maxHealth: 0,
      currentMana: 0,
      maxMana: 0,
      currentMacula: 0,
      maxMacula: 0,
      currentEnergy: 0,
      maxEnergy: 0,
      luck: 0,
      sanity: 0,
      deathTest1: false,
      deathTest2: false,
      deathTest3: false,
      resurrection1: false,
      resurrection2: false,
      movementBase: 0,
      movementBonus: 0,
      initiativeBase: 0,
      initiativeBonus: 0,
      blessing: "",
      advantages: "",
      disadvantages: "",
      classTests: "",
      abilities: "",
      spells: "",
      backpack: "",
      gold: 0,
      otherResources: "",
      relations: "",
      narrative: "",
    },
  });

  // Update character mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertCharacter>) => {
      return apiRequest("PATCH", `/api/characters/${characterId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      queryClient.invalidateQueries({ queryKey: ['/api/characters', characterId] });
      toast({
        title: "Dados salvos",
        description: "Ficha do personagem atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da ficha.",
        variant: "destructive",
      });
    },
  });

  // Delete character mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/characters/${characterId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      toast({
        title: "Personagem excluído",
        description: "O personagem foi excluído com sucesso.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o personagem.",
        variant: "destructive",
      });
    },
  });

  // Manual save function
  const handleSave = () => {
    const formData = form.getValues();
    updateMutation.mutate(formData);
  };

  // Load character data into form
  useEffect(() => {
    if (character) {
      form.reset(character);
    }
  }, [character, form]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando ficha do personagem...</div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Personagem não encontrado</h2>
            <p className="text-slate-600 mb-4">O personagem que você está procurando não existe.</p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-to-list">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const SkillInput = ({ 
    baseName, 
    bonusName, 
    label 
  }: { 
    baseName: keyof InsertCharacter; 
    bonusName: keyof InsertCharacter; 
    label: string;
  }) => (
    <div className="flex items-center gap-3" data-testid={`skill-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center gap-1">
        <span className="text-sm text-slate-600">(</span>
        <Input
          type="number"
          {...form.register(baseName, { valueAsNumber: true })}
          className="w-12 px-1 py-1 text-center text-sm h-8"
          data-testid={`input-${baseName}`}
        />
        <span className="text-sm text-slate-600">) + (</span>
        <Input
          type="number"
          {...form.register(bonusName, { valueAsNumber: true })}
          className="w-12 px-1 py-1 text-center text-sm h-8"
          data-testid={`input-${bonusName}`}
        />
        <span className="text-sm text-slate-600">)</span>
      </div>
      <Label className="text-sm font-medium text-slate-700 flex-1">{label}</Label>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/")}
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {character?.name || "Personagem sem nome"}
                  </h1>
                  <p className="text-sm text-slate-600">Amanae — Filhos de Kaos RPG</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">Ver 8.0</Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-delete-character">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir personagem</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir "{character?.name || 'este personagem'}"? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            {/* Basic Character Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Nome do personagem"
                  data-testid="input-name"
                />
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  {...form.register("age", { valueAsNumber: true })}
                  placeholder="25"
                  data-testid="input-age"
                />
              </div>
              <div>
                <Label htmlFor="height">Altura</Label>
                <Input
                  id="height"
                  {...form.register("height")}
                  placeholder="1.75m"
                  data-testid="input-height"
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso</Label>
                <Input
                  id="weight"
                  {...form.register("weight")}
                  placeholder="70kg"
                  data-testid="input-weight"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
              <div>
                <Label htmlFor="experience">Exp</Label>
                <Input
                  id="experience"
                  type="number"
                  {...form.register("experience", { valueAsNumber: true })}
                  placeholder="1500"
                  data-testid="input-experience"
                />
              </div>
              <div>
                <Label htmlFor="level">Nível</Label>
                <Input
                  id="level"
                  type="number"
                  {...form.register("level", { valueAsNumber: true })}
                  placeholder="3"
                  data-testid="input-level"
                />
              </div>
              <div>
                <Label htmlFor="race">Raça</Label>
                <Input
                  id="race"
                  {...form.register("race")}
                  placeholder="Humano"
                  data-testid="input-race"
                />
              </div>
              <div>
                <Label htmlFor="characterClass">Classe</Label>
                <Input
                  id="characterClass"
                  {...form.register("characterClass")}
                  placeholder="Guerreiro"
                  data-testid="input-character-class"
                />
              </div>
              <div>
                <Label htmlFor="vocation">Vocação</Label>
                <Input
                  id="vocation"
                  {...form.register("vocation")}
                  placeholder="Protetor"
                  data-testid="input-vocation"
                />
              </div>
              <div>
                <Label htmlFor="pact">Pacto</Label>
                <Input
                  id="pact"
                  {...form.register("pact")}
                  placeholder="Nenhum"
                  data-testid="input-pact"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Character Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Main Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Atributos Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="w-16 text-sm font-medium">Vida:</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">(</span>
                  <Input
                    type="number"
                    {...form.register("currentHealth", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-current-health"
                  />
                  <span className="text-sm text-slate-600">) / (</span>
                  <Input
                    type="number"
                    {...form.register("maxHealth", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-max-health"
                  />
                  <span className="text-sm text-slate-600">)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-16 text-sm font-medium">Mana:</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">(</span>
                  <Input
                    type="number"
                    {...form.register("currentMana", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-current-mana"
                  />
                  <span className="text-sm text-slate-600">) / (</span>
                  <Input
                    type="number"
                    {...form.register("maxMana", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-max-mana"
                  />
                  <span className="text-sm text-slate-600">)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-16 text-sm font-medium">Mácula:</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">(</span>
                  <Input
                    type="number"
                    {...form.register("currentMacula", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-current-macula"
                  />
                  <span className="text-sm text-slate-600">) / (</span>
                  <Input
                    type="number"
                    {...form.register("maxMacula", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-max-macula"
                  />
                  <span className="text-sm text-slate-600">)</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-16 text-sm font-medium">Energia:</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">(</span>
                  <Input
                    type="number"
                    {...form.register("currentEnergy", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-current-energy"
                  />
                  <span className="text-sm text-slate-600">) / (</span>
                  <Input
                    type="number"
                    {...form.register("maxEnergy", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-max-energy"
                  />
                  <span className="text-sm text-slate-600">)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Atributos Secundários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Sorte:</Label>
                <Input
                  type="number"
                  {...form.register("luck", { valueAsNumber: true })}
                  className="w-20 px-2 py-1 text-center"
                  data-testid="input-luck"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Sanidade:</Label>
                <Input
                  type="number"
                  {...form.register("sanity", { valueAsNumber: true })}
                  className="w-20 px-2 py-1 text-center"
                  data-testid="input-sanity"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Teste de morte:</Label>
                <div className="flex gap-1">
                  <Checkbox
                    {...form.register("deathTest1")}
                    data-testid="checkbox-death-test-1"
                  />
                  <Checkbox
                    {...form.register("deathTest2")}
                    data-testid="checkbox-death-test-2"
                  />
                  <Checkbox
                    {...form.register("deathTest3")}
                    data-testid="checkbox-death-test-3"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Ressurreição:</Label>
                <div className="flex gap-1">
                  <Checkbox
                    {...form.register("resurrection1")}
                    data-testid="checkbox-resurrection-1"
                  />
                  <Checkbox
                    {...form.register("resurrection2")}
                    data-testid="checkbox-resurrection-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Deslocamento:</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    {...form.register("movementBase", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-movement-base"
                  />
                  <span className="text-sm text-slate-600">+</span>
                  <Input
                    type="number"
                    {...form.register("movementBonus", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-movement-bonus"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Iniciativa:</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    {...form.register("initiativeBase", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-initiative-base"
                  />
                  <span className="text-sm text-slate-600">+</span>
                  <Input
                    type="number"
                    {...form.register("initiativeBonus", { valueAsNumber: true })}
                    className="w-16 px-2 py-1 text-center"
                    data-testid="input-initiative-bonus"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Bênção:</Label>
                <Input
                  {...form.register("blessing")}
                  className="w-32 px-2 py-1 text-center"
                  placeholder="Nenhuma"
                  data-testid="input-blessing"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Physical Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Perícias Físicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SkillInput baseName="forceBase" bonusName="forceBonus" label="Força" />
              <SkillInput baseName="aimBase" bonusName="aimBonus" label="Pontaria" />
              <SkillInput baseName="combatBase" bonusName="combatBonus" label="Combate" />
              <SkillInput baseName="dodgeBase" bonusName="dodgeBonus" label="Esquiva" />
              <SkillInput baseName="defenseBase" bonusName="defenseBonus" label="Defesa" />
              <SkillInput baseName="athleticsBase" bonusName="athleticsBonus" label="Atletismo" />
              <SkillInput baseName="ridingBase" bonusName="ridingBonus" label="Montaria" />
              <SkillInput baseName="stealthBase" bonusName="stealthBonus" label="Furtividade" />
              <SkillInput baseName="reflexBase" bonusName="reflexBonus" label="Reflexo" />
              <SkillInput baseName="theftBase" bonusName="theftBonus" label="Furto" />
              <SkillInput baseName="lockpickingBase" bonusName="lockpickingBonus" label="Arrombamento" />
            </CardContent>
          </Card>

          {/* Mental Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Perícias Mentais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SkillInput baseName="willpowerBase" bonusName="willpowerBonus" label="Força de vontade" />
              <SkillInput baseName="socializationBase" bonusName="socializationBonus" label="Socialização" />
              <SkillInput baseName="scientificBase" bonusName="scientificBonus" label="Científico" />
              <SkillInput baseName="linguisticBase" bonusName="linguisticBonus" label="Linguístico" />
              <SkillInput baseName="medicalBase" bonusName="medicalBonus" label="Medicinal" />
              <SkillInput baseName="emanationBase" bonusName="emanationBonus" label="Emanação" />
              <SkillInput baseName="magicControlBase" bonusName="magicControlBonus" label="Controle mágico" />
              <SkillInput baseName="metallurgyBase" bonusName="metallurgyBonus" label="Metalurgia" />
              <SkillInput baseName="writingBase" bonusName="writingBonus" label="Escrita" />
              <SkillInput baseName="magicSensitivityBase" bonusName="magicSensitivityBonus" label="Sensibilidade mágica" />
              <SkillInput baseName="perceptionBase" bonusName="perceptionBonus" label="Percepção" />
            </CardContent>
          </Card>
        </div>

        {/* Equipment Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Primary Weapon */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-700">Arma Principal</h3>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Nome</Label>
                  <Input
                    {...form.register("primaryWeaponName")}
                    className="text-sm"
                    placeholder="Espada Longa"
                    data-testid="input-primary-weapon-name"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Dano</Label>
                  <Input
                    {...form.register("primaryWeaponDamage")}
                    className="text-sm"
                    placeholder="1d8+3"
                    data-testid="input-primary-weapon-damage"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Duração</Label>
                  <Input
                    {...form.register("primaryWeaponDuration")}
                    className="text-sm"
                    placeholder="Permanente"
                    data-testid="input-primary-weapon-duration"
                  />
                </div>
              </div>

              {/* Secondary Weapon */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-700">Arma Secundária</h3>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Nome</Label>
                  <Input
                    {...form.register("secondaryWeaponName")}
                    className="text-sm"
                    placeholder="Adaga"
                    data-testid="input-secondary-weapon-name"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Dano</Label>
                  <Input
                    {...form.register("secondaryWeaponDamage")}
                    className="text-sm"
                    placeholder="1d4+1"
                    data-testid="input-secondary-weapon-damage"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Duração</Label>
                  <Input
                    {...form.register("secondaryWeaponDuration")}
                    className="text-sm"
                    placeholder="Permanente"
                    data-testid="input-secondary-weapon-duration"
                  />
                </div>
              </div>

              {/* Armor */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-700">Armadura</h3>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Nome</Label>
                  <Input
                    {...form.register("armorName")}
                    className="text-sm"
                    placeholder="Armadura de Couro"
                    data-testid="input-armor-name"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Proteção</Label>
                  <Input
                    {...form.register("armorProtection")}
                    className="text-sm"
                    placeholder="2"
                    data-testid="input-armor-protection"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Duração</Label>
                  <Input
                    {...form.register("armorDuration")}
                    className="text-sm"
                    placeholder="Permanente"
                    data-testid="input-armor-duration"
                  />
                </div>
              </div>

              {/* Negative Effects */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-700">Efeitos Negativos</h3>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Nome</Label>
                  <Input
                    {...form.register("negativeEffectName")}
                    className="text-sm"
                    placeholder="Nenhum"
                    data-testid="input-negative-effect-name"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Descrição</Label>
                  <Input
                    {...form.register("negativeEffectDescription")}
                    className="text-sm"
                    placeholder="-"
                    data-testid="input-negative-effect-description"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-slate-600 mb-1">Duração</Label>
                  <Input
                    {...form.register("negativeEffectDuration")}
                    className="text-sm"
                    placeholder="-"
                    data-testid="input-negative-effect-duration"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Character Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Advantages & Disadvantages */}
          <Card>
            <CardHeader>
              <CardTitle>Vantagens & Desvantagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="block font-medium text-slate-700 mb-2">Vantagens</Label>
                <Textarea
                  {...form.register("advantages")}
                  className="text-sm resize-none"
                  rows={6}
                  placeholder="- Corajoso&#10;- Força excepcional&#10;- Liderança natural"
                  data-testid="textarea-advantages"
                />
              </div>
              
              <div>
                <Label className="block font-medium text-slate-700 mb-2">Desvantagens</Label>
                <Textarea
                  {...form.register("disadvantages")}
                  className="text-sm resize-none"
                  rows={6}
                  placeholder="- Impulsivo&#10;- Medo de altura&#10;- Código de honra"
                  data-testid="textarea-disadvantages"
                />
              </div>
            </CardContent>
          </Card>

          {/* Class Tests & Abilities */}
          <Card>
            <CardHeader>
              <CardTitle>Testes & Habilidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="block font-medium text-slate-700 mb-2">Testes e Habilidades de Classe</Label>
                <Textarea
                  {...form.register("classTests")}
                  className="text-sm resize-none"
                  rows={6}
                  placeholder="- Golpe poderoso&#10;- Provocar inimigo&#10;- Resistência ao dano"
                  data-testid="textarea-class-tests"
                />
              </div>
              
              <div>
                <Label className="block font-medium text-slate-700 mb-2">Habilidades</Label>
                <Textarea
                  {...form.register("abilities")}
                  className="text-sm resize-none"
                  rows={6}
                  placeholder="- Segundo fôlego&#10;- Ataque extra&#10;- Defesa aprimorada"
                  data-testid="textarea-abilities"
                />
              </div>
            </CardContent>
          </Card>

          {/* Spells */}
          <Card>
            <CardHeader>
              <CardTitle>Magias</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...form.register("spells")}
                className="text-sm resize-none"
                rows={14}
                placeholder="- Cura menor&#10;- Proteção divina&#10;- Luz sagrada&#10;&#10;(Liste suas magias conhecidas, custo de mana e descrição)"
                data-testid="textarea-spells"
              />
            </CardContent>
          </Card>
        </div>

        {/* Inventory & Relations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Backpack */}
          <Card>
            <CardHeader>
              <CardTitle>Mochila</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...form.register("backpack")}
                className="text-sm resize-none"
                rows={12}
                placeholder="- Corda (50m)&#10;- Tochas (5x)&#10;- Ração de viagem (3 dias)&#10;- Kit de primeiros socorros&#10;- Mapa da região&#10;- Cantil&#10;- Saco de dormir"
                data-testid="textarea-backpack"
              />
            </CardContent>
          </Card>

          {/* Gold */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="block font-medium text-slate-700 mb-2">Ouro</Label>
                <Input
                  type="number"
                  {...form.register("gold", { valueAsNumber: true })}
                  placeholder="150"
                  data-testid="input-gold"
                />
              </div>
              <div>
                <Label className="block font-medium text-slate-700 mb-2">Outros recursos</Label>
                <Textarea
                  {...form.register("otherResources")}
                  className="text-sm resize-none"
                  rows={8}
                  placeholder="- Favores devidos&#10;- Contatos importantes&#10;- Propriedades"
                  data-testid="textarea-other-resources"
                />
              </div>
            </CardContent>
          </Card>

          {/* Relations */}
          <Card>
            <CardHeader>
              <CardTitle>Relações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...form.register("relations")}
                className="text-sm resize-none"
                rows={12}
                placeholder="- Mestre Aldric (mentor)&#10;- Guilda dos Mercadores (aliado)&#10;- Lorde Blackwood (inimigo)&#10;- Taverna do Javali Dourado (refúgio)"
                data-testid="textarea-relations"
              />
            </CardContent>
          </Card>
        </div>

        {/* Character History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Histórico Narrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="block font-medium text-slate-700 mb-2">
              História do personagem e suas relações com o mundo do jogo
            </Label>
            <Textarea
              {...form.register("narrative")}
              className="resize-none"
              rows={8}
              placeholder="Nascido em uma pequena vila nas montanhas, sempre demonstrou coragem e liderança natural. Após a destruição de sua aldeia por bandidos, jurou proteger os inocentes e buscar justiça. Treinou sob a tutela do Mestre Aldric e agora aventura-se pelo mundo, construindo alianças e enfrentando as forças do caos...&#10;&#10;Registre aqui eventos importantes, relacionamentos, objetivos pessoais e como seu personagem se conecta com a narrativa principal da campanha."
              data-testid="textarea-narrative"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
            data-testid="button-save"
          >
            <Save className={`h-5 w-5 mr-2 ${updateMutation.isPending ? 'animate-spin' : ''}`} />
            {updateMutation.isPending ? 'Salvando...' : 'Salvar Ficha'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>Todos os direitos reservados©</p>
        </div>
      </div>
    </div>
  );
}
