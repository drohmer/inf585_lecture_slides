clear;
clf; close all;

p0 = 1;
v0 = 0;

h = 0.2;
K=1;
m=1;

p=p0;
v=v0;
P = p;

N=150;

for kk=[1:N]
    v = v+h/2*(-K/m*p);
    p = p + h*v;
    v = v + h/2 * (-K/m*p);

    P=[P,p];
end

p2=p0;
v2=v0;
P2=[p2];
for kk=[1:N]
    v2 = v2+h*(-K/m*p2);
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
    p3 = a*cos(omega*kk*h+phi);
    P3=[P3,p3];
end



p4=p0;
v4=v0;
P4=[p4];

for kk=[1:N]

    k1 = h*[v4,-K/m*p4];
    k2 = h*([v4+k1(2)/2,-K/m*(p4+k1(1)/2)]);
    k3 = h*([v4+k2(2)/2,-K/m*(p4+k2(1)/2)]);
    k4 = h*([v4+k3(2),-K/m*(p4+k3(1))]);

    p4 = p4 + 1/6*(k1(1)+2*k2(1)+2*k3(1)+k4(1));
    v4 = v4 + 1/6*(k1(2)+2*k2(2)+2*k3(2)+k4(2));

    P4=[P4,p4];
end


p5=p0;
v5=v0;
P5=[p5];

for kk=[1:N]

    k1 = h*[v5,-K/m*p5];
    k2 = h*[v5+k1(2),-K/m*(p5+k1(1))];

    p5 = p5 + 1/2*(k1(1)+k2(1));
    v5 = v5 + 1/2*(k1(2)+k2(2));

    P5=[P5,p5];
end


%implicit euler
p6=p0;
v6=v0;
P6=[p6];

for kk=[1:N]

    pi2 = 1/(1+h*h*K/m)*(p6 + h*v6);
    vi2 = 1/(1+h*h*K/m)*(-K/m*h*p6+v6);
    p6=pi2;
    v6=vi2;

    P6=[P6,p6];
end

%plot(P,'b+-');
hold on;
%plot(P2,'r+-');

plot(P3,'r+-','linewidth',3);
plot(P4,'k+-','linewidth',2);
%plot(P5,'m+-');
plot(P6,'m+-','linewidth',2);

figure(2);
%plot(abs(P3-P2),'r');
%hold on;
%plot(abs(P3-P),'b');
plot(abs(P3-P4),'k');
%plot(abs(P3-P5),'m');