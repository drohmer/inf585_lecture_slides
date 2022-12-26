clear;
clf;

p0 = [1;1];
v0 = [1;2];

p=p0;
v=v0;

P=[p0];
V=[v0];
Pt=[p0];

h=0.1;

for k=[1:50]

    v = v + h*(i)*p; %[0;-9.81];
    p = p + h*v;
    
    
    
    P=[P,p];
    V=[V,p];

    Pt = [Pt,1/2*[0;-9.81]*(k*h)^2+v0*k*h+p0];

end


%plot(P(1,:),P(2,:),'b+');
%hold on
plot(abs(P(1,:)),'r');