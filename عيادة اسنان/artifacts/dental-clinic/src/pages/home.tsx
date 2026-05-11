import { motion } from "framer-motion";
import { Star, CheckCircle, Clock, Users, GraduationCap } from "lucide-react";
import doctorImage from "@/assets/doctor.png";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    { icon: GraduationCap, title: "شهادات عليا", desc: "دكتوراه في طب وجراحة الفم والأسنان" },
    { icon: Clock, title: "خبرة طويلة", desc: "أكثر من 15 عاماً من الخبرة العملية" },
    { icon: Users, title: "ثقة المرضى", desc: "أكثر من 3000 مريض سعيد" },
    { icon: CheckCircle, title: "تقنيات حديثة", desc: "استخدام أحدث تقنيات طب الأسنان" }
  ];

  const testimonials = [
    { name: "خالد السالم", text: "تجربة ممتازة، العيادة نظيفة جداً والدكتور يده خفيفة ومحترف.", rating: 5 },
    { name: "سارة محمد", text: "أفضل دكتور أسنان تعاملت معه، يشرح كل خطوة بالتفصيل ومريح جداً.", rating: 5 },
    { name: "أحمد عبدالله", text: "النتيجة بعد تركيب التقويم كانت مذهلة، شكراً للدكتور وطاقم العيادة.", rating: 5 },
    { name: "نورة فهد", text: "ابتسامتي تغيرت للأفضل بفضل الله ثم بفضل د. أحمد، أنصح به بشدة.", rating: 5 }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/50 via-background to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-right"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                ابتسامتك المثالية <br/>
                <span className="text-primary">تبدأ من هنا</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                نجمع بين الخبرة العميقة والتقنيات الحديثة لنقدم لك أفضل رعاية صحية لأسنانك في بيئة فاخرة ومريحة.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                  <Link href="/contact">احجز موعدك الآن</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                  <Link href="/3d-teeth">شاهد التقييم ثلاثي الأبعاد</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-secondary overflow-hidden border-4 border-white shadow-2xl">
                  <img 
                    src={doctorImage} 
                    alt="د. أحمد المنصوري" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">تعرف على طبيبك</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              د. أحمد المنصوري، استشاري طب وجراحة الفم والأسنان، يكرس خبرته لتقديم أفضل النتائج لمرضاه.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">آراء مرضانا</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نفخر بالثقة التي يمنحنا إياها مرضانا، وهي الدافع لنا لتقديم الأفضل دائماً.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-8 rounded-2xl shadow-sm border border-border"
              >
                <div className="flex text-yellow-500 mb-4 gap-1">
                  {[...Array(test.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-foreground mb-6 font-medium leading-relaxed">"{test.text}"</p>
                <div className="font-bold text-primary">{test.name}</div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link href="/reviews">شاركنا رأيك</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
