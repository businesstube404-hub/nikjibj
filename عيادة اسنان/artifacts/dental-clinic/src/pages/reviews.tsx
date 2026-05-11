import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useCreateReview } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
  message: z.string().min(10, { message: "الرسالة يجب أن تكون 10 أحرف على الأقل" }),
});

export default function Reviews() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createReview = useCreateReview();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createReview.mutate({ data: values }, {
      onSuccess: () => {
        setIsSubmitted(true);
        form.reset();
      }
    });
  }

  return (
    <div className="py-20 bg-background min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">آراء المرضى</h1>
          <p className="text-lg text-muted-foreground">
            يهمنا رأيك وتجربتك معنا. شاركنا انطباعك عن زيارتك للعيادة.
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm relative overflow-hidden">
          {isSubmitted ? (
            <div className="text-center py-12 px-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">شكراً لمشاركتك!</h2>
              <p className="text-muted-foreground mb-8">
                تم إرسال رأيك بنجاح. نقدر وقتك وثقتك بنا.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                إرسال تقييم آخر
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 mb-6 border border-blue-100">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">
                    آراؤكم لا تظهر للعموم، وتُحفظ للدكتور فقط بهدف التطوير المستمر لخدماتنا.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">الاسم الكريم</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: عبدالله محمد" className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">كيف كانت تجربتك؟</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="اكتب رسالتك وتقييمك هنا..." 
                          className="min-h-[120px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-bold" 
                  disabled={createReview.isPending}
                >
                  {createReview.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
