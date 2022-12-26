clear;

x=linspace(-5,5,300);
a=1;
b=(x-2);
c=1;

d = b.*b-4*a*c;
r1 = (-b+d.^(0.5))./(2*a);
r2 = (-b-d.^(0.5))./(2*a);

plot(x,abs(r1),'k');
hold on
plot(x,abs(r2),'r');