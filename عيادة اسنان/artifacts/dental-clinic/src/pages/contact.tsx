import { MapPin, Phone, Mail, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">تواصل معنا</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لخدمتك والإجابة على كافة استفساراتك. احجز موعدك الآن بكل سهولة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Panel */}
          <div className="space-y-8">
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-6">معلومات العيادة</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">الموقع</h3>
                    <p className="text-muted-foreground">الرياض، طريق الملك فهد، برج المملكة الطبية، الدور 5</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">رقم الهاتف</h3>
                    <p className="text-muted-foreground" dir="ltr">+966 50 000 0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">أوقات العمل</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p className="flex justify-between max-w-[200px]"><span>الأحد - الخميس:</span> <span>9 ص - 9 م</span></p>
                      <p className="flex justify-between max-w-[200px]"><span>السبت:</span> <span>4 م - 9 م</span></p>
                      <p className="flex justify-between max-w-[200px] text-destructive"><span>الجمعة:</span> <span>مغلق</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 gap-2">
                  <CalendarDays className="w-5 h-5" />
                  حجز موعد
                </Button>
                <Button size="lg" variant="outline" className="flex-1 gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366] border-[#25D366]/30">
                  <Phone className="w-5 h-5" />
                  واتساب
                </Button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[500px] rounded-2xl overflow-hidden border shadow-sm bg-muted relative">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=46.6641%2C24.6877%2C46.7941%2C24.8077&layer=mapnik&marker=24.7477%2C46.7291"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              className="absolute inset-0"
              title="موقع العيادة"
            ></iframe>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs text-foreground font-medium shadow-sm">
              الرياض، طريق الملك فهد
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
