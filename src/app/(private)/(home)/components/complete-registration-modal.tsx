"use client";

import Field from "@/app/(public)/login/components/field";
import {
  Form,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/blocks/form";
import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { maskCpfCnpj, maskPhone } from "@/utils/masks";
import { getCurrentPlatform } from "@/utils/platform";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Hash, Loader2, Phone, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const FormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  phone: z.string().min(14, "Telefone inválido ou incompleto"),
  cpfCnpj: z.string().min(14, "Documento inválido"),
});

type FormValues = z.infer<typeof FormSchema>;

export function CompleteRegistrationModal() {
  const { profile, handleGetProfile } = useSession();
  const { PutAPI } = useApiContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Image Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1920&auto=format&fit=crop",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  // Check if user needs to complete registration
  useEffect(() => {
    if (profile) {
      const isMissingData = !profile.cpfCnpj || !profile.mobilePhone;
      if (isMissingData) {
        setIsOpen(true);
      }
    }
  }, [profile]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.mobilePhone || "",
      cpfCnpj: profile?.cpfCnpj || "",
    },
  });

  // Update form default values when profile loads
  useEffect(() => {
    if (profile) {
      if (!form.getValues("name")) form.setValue("name", profile.name);
      if (!form.getValues("phone") && profile.mobilePhone)
        form.setValue("phone", maskPhone(profile.mobilePhone));
      if (!form.getValues("cpfCnpj") && profile.cpfCnpj)
        form.setValue("cpfCnpj", maskCpfCnpj(profile.cpfCnpj));
    }
  }, [profile, form]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Remove máscaras antes de enviar para a API
      const cleanPhone = data.phone.replace(/\D/g, ""); // Remove tudo exceto números
      const cleanCpfCnpj = data.cpfCnpj.replace(/\D/g, ""); // Remove tudo exceto números

            // Envia os dados para a API
            const response = await PutAPI(
                "/user",
                {
                    name: data.name,
                    mobilePhone: cleanPhone,
                    cpfCnpj: cleanCpfCnpj,
                    registrationPlatform: getCurrentPlatform(),
                },
                true // true = requer autenticação
            );

      if (response.status === 200) {
        toast.success("Cadastro atualizado com sucesso!");
        // Recarrega o perfil da API para garantir dados atualizados
        await handleGetProfile(true);
        setIsOpen(false);
      } else {
        toast.error(
          response.body?.message || "Erro ao salvar dados. Tente novamente.",
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar cadastro:", error);
      toast.error("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[6px] duration-300">
      <div className="animate-in zoom-in-95 slide-in-from-bottom-5 relative flex min-h-[600px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-500 md:flex-row">
        {/* Left Side: Image Carousel */}
        <div className="relative hidden w-1/2 overflow-hidden bg-stone-950 md:block">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />

          <div className="absolute top-10 left-10 z-20">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <div className="h-2 w-2 animate-pulse rounded-full bg-stone-700 shadow-[0_0_8px_rgba(180,83,9,0.8)]" />
              <span className="text-xs font-semibold tracking-wide text-white">
                Plataforma Segura
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 z-20 max-w-md pr-8 text-white">
            <h3 className="text-3xl leading-tight font-bold tracking-tight">
              A revolução do <br /> atendimento médico.
            </h3>
            <p className="mt-4 text-base leading-relaxed font-light text-stone-100 opacity-90">
              Junte-se a milhares de profissionais que transformaram sua rotina
              jurídica com a Jurid Voice.
            </p>
          </div>

          {images.map((img, index) => (
            <div
              key={img}
              className={cn(
                "absolute inset-0 h-full w-full transform bg-cover bg-center transition-all duration-1000 ease-in-out",
                index === currentImageIndex
                  ? "scale-105 opacity-100"
                  : "scale-100 opacity-0",
              )}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}

          <div className="absolute right-10 bottom-10 z-20 flex gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === currentImageIndex
                    ? "w-8 bg-stone-700"
                    : "w-2 bg-white/30",
                )}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="relative flex w-full flex-col justify-center bg-white p-8 md:w-1/2 md:p-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 flex flex-col items-center text-center md:items-start md:text-left">
              {/* Branding with logo-dark.png */}
              <div className="mb-6">
                <Image
                  src="/logos/logo-dark.png"
                  alt="Jurid Voice Logo"
                  width={180}
                  height={50}
                  className="h-auto max-h-[45px] w-auto"
                />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Complete seu perfil
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Precisamos de alguns detalhes para liberar seu acesso total. É
                rápido e seguro.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Field
                        placeholder="Nome Completo"
                        label="Nome"
                        name="name"
                        autoComplete="name"
                        Svg={<User className="text-stone-700" size={20} />}
                        value={field.value}
                        onChange={field.onChange}
                        required
                        invalid={!!fieldState.error}
                      />
                      <FormMessage className="ml-1 text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Field
                        placeholder="(00) 00000-0000"
                        label="Telefone (WhatsApp)"
                        name="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        Svg={<Phone className="text-stone-700" size={20} />}
                        value={maskPhone(field.value)}
                        onChange={(e: any) => field.onChange(e.target.value)}
                        required
                        maxLength={16}
                        invalid={!!fieldState.error}
                      />
                      <FormMessage className="ml-1 text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpfCnpj"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Field
                        placeholder="000.000.000-00"
                        label="CPF ou CNPJ"
                        name="cpf"
                        inputMode="numeric"
                        Svg={<Hash className="text-stone-700" size={20} />}
                        value={field.value}
                        onChange={(e: any) =>
                          field.onChange(maskCpfCnpj(e.target.value))
                        }
                        required
                        maxLength={18}
                        invalid={!!fieldState.error}
                      />
                      <FormMessage className="ml-1 text-xs font-medium text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading || !form.formState.isValid}
                    className={cn(
                      "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-stone-900 to-stone-950 py-4 text-sm font-bold text-white shadow-xl shadow-stone-800/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-stone-800/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70",
                    )}
                  >
                    <div className="absolute inset-0 h-full w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="animate-pulse">Finalizando...</span>
                      </>
                    ) : (
                      <>
                        <span>Concluir Cadastro</span>
                        <CheckCircle2 className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
                      </>
                    )}
                  </button>
                  <p className="mt-6 text-center text-xs font-medium text-slate-400">
                    Ao continuar, você aceita nossos{" "}
                    <span className="cursor-pointer font-semibold text-stone-900 hover:underline">
                      Termos de Uso
                    </span>{" "}
                    e{" "}
                    <span className="cursor-pointer font-semibold text-stone-900 hover:underline">
                      Política de Privacidade
                    </span>
                    .
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
