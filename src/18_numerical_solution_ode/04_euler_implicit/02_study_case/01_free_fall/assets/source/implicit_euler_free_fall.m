clear;
clf;

p0 = [0;0];
v0 = [1;20];

p=p0;
v=v0;

P=[p0];
V=[v0];

h=0.5;

N=10;
for k=[0:N]

    p = p + h*v;
    v = v + h*[0;-9.81];
    
    P=[P,p];
    V=[V,p];

end


p2=p0;
v2=v0;
P2=[p0];
V2=[v0];
g=[0;-9.81];

for k=[0:N]

    p2 = p2 + h*v2 + h*h*g;
    v2 = v2 + h*g;
    
    P2=[P2,p2];
    V2=[V2,p2];

end

tt = h*[0:N+1];
T = 1/2*[0;-9.81]*tt.*tt+v0*tt+p0;

plot(P(1,:),P(2,:),'b+-','linewidth',3);
hold on
plot(P2(1,:),P2(2,:),'m+-','linewidth',3);
plot(T(1,:),T(2,:),'r+-','linewidth',3);
