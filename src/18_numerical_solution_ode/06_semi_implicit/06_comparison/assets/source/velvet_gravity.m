clear;
clf; close all;

p0 = 1;
v0 = 0;

h = 0.5;
K=1;
m=1;

g=9.81;

p=p0;
v=v0;
P = p;

N=60;

for kk=[1:N]
    v = v+h/2*(g);
    p = p + h*v;
    v = v + h/2 * (g);

    P=[P,p];
end

p2=p0;
v2=v0;
P2=[p2];
for kk=[1:N]
    v2 = v2+h*(g);
    p2 = p2 + h*v2;
    P2=[P2,p2];
end


p3=p0;
v3=v0;
P3=[p3];
omega=sqrt(K/m);
a = p0*p0+(v0/omega)^2;
phi=atan2(v0,omega*p0);
for kk=[1:N]
    p3 = 1/2*g*(kk*h)^2+v0*kk*h+p0;
    P3=[P3,p3];
end



p4=p0;
v4=v0;
P4=[p4];

for kk=[1:N]

    k1 = h*[v4,g];
    k2 = h*([v4+k1(2)/2,g]);
    k3 = h*([v4+k2(2)/2,g]);
    k4 = h*([v4+k3(2),g]);

    p4 = p4 + 1/6*(k1(1)+2*k2(1)+2*k3(1)+k4(1));
    v4 = v4 + 1/6*(k1(2)+2*k2(2)+2*k3(2)+k4(2));

    P4=[P4,p4];
end


p5=p0;
v5=v0;
P5=[p5];

for kk=[1:N]

    k1 = h*[v5,g];
    k2 = h*[v5+k1(2),g];

    p5 = p5 + 1/2*(k1(1)+k2(1));
    v5 = v5 + 1/2*(k1(2)+k2(2));

    P5=[P5,p5];
end

plot(P,'b+-');
hold on;
plot(P2,'r+-');
plot(P3,'g+-');
%plot(P4,'k+-');
%plot(P5,'m+-');

figure(2);
plot(abs(P3-P2),'r');
hold on;
plot(abs(P3-P),'b');
plot(abs(P3-P4),'k');
plot(abs(P3-P5),'m');